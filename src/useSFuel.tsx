/**
 * @license
 * SKALE portal
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * @file useSFuel.tsx
 * @copyright SKALE Labs 2024-Present
 */

import { useState, useEffect } from 'react'
import { Logger, type ILogObj } from 'tslog'
import { useWagmiAccount, type MetaportCore, Station } from '@skalenetwork/metaport'
import { DEFAULT_MIN_SFUEL_WEI, SFUEL_CHECK_INTERVAL } from './core/constants'

const log = new Logger<ILogObj>({ name: 'useSFuel' })

const CHAINS_TO_SKIP = ['turbulent-unique-scheat'] // todo: tmp fix, remove later

export function usesFuel(mpc: MetaportCore) {
  const { address } = useWagmiAccount()
  const [state, setState] = useState({
    sFuelOk: true,
    isMining: false,
    chainsWithFaucet: [] as string[]
  })

  useEffect(() => {
    async function checkFaucetAvailability() {
      const chainsWithFaucet = await Promise.all(
        mpc.config.chains
          .filter((chain) => !CHAINS_TO_SKIP.includes(chain))
          .map(async (chain) => {
            const station = new Station(chain, mpc)
            return (await station.isFaucetAvailable()) ? chain : null
          })
      ).then((chains) => chains.filter((chain): chain is string => chain !== null))
      setState((prev) => ({ ...prev, chainsWithFaucet }))
    }
    checkFaucetAvailability()
  }, [mpc.config.chains, mpc.config.skaleNetwork])

  async function checkSFuelBalance(): Promise<boolean> {
    if (!address) return true
    for (const chain of state.chainsWithFaucet) {
      if (CHAINS_TO_SKIP.includes(chain)) continue
      const { balance } = await new Station(chain, mpc).getData(address)
      if (balance < DEFAULT_MIN_SFUEL_WEI) {
        setState((prev) => ({ ...prev, sFuelOk: false }))
        return false
      }
    }
    setState((prev) => ({ ...prev, sFuelOk: true }))
    return true
  }

  const mineSFuel = async () => {
    if (!address) return
    setState((prev) => ({ ...prev, isMining: true }))
    let errorOccurred = false

    for (const chain of state.chainsWithFaucet) {
      if (CHAINS_TO_SKIP.includes(chain)) continue
      try {
        const station = new Station(chain, mpc)
        const { balance } = await station.getData(address)
        if (balance < DEFAULT_MIN_SFUEL_WEI) {
          log.info(`Mining sFuel on chain ${chain}`)
          const powResult = await station.doPoW(address)
          if (!powResult.ok) {
            log.error(`Failed to mine sFuel on chain ${chain}: ${powResult.message}`)
            errorOccurred = true
          }
        }
      } catch (error) {
        log.error(`Error processing chain ${chain}:`, error)
        errorOccurred = true
      }
    }

    if (errorOccurred) {
      log.error('sFuel mining encountered errors on one or more chains')
    } else {
      log.info('sFuel mining completed successfully on all required chains')
    }

    setState((prev) => ({ ...prev, sFuelOk: !errorOccurred, isMining: false }))
  }

  useEffect(() => {
    if (!address) return
    let intervalId: NodeJS.Timeout

    async function checkAndSetInterval() {
      await checkSFuelBalance()
      intervalId = setInterval(checkSFuelBalance, SFUEL_CHECK_INTERVAL)
    }

    checkAndSetInterval()

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [address, state.chainsWithFaucet])

  return { ...state, mineSFuel }
}
