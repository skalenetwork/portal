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

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Logger, type ILogObj } from 'tslog'
import { useWagmiAccount, type MetaportCore, Station } from '@skalenetwork/metaport'
import { DEFAULT_MIN_SFUEL_WEI, SFUEL_CHECK_INTERVAL } from './core/constants'
import { types } from '@/core'

const log = new Logger<ILogObj>({ name: 'useSFuel' })

interface SFuelState {
  sFuelOk: boolean
  isMining: boolean
  chainsWithFaucet: string[]
  totalChainsWithStation: number
  chainsWithEnoughSFuel: number
  currentAddress: types.AddressType | null
  loading: boolean
  intervalId: number | null
}

export function usesFuel(mpc: MetaportCore) {
  const { address } = useWagmiAccount()
  const [state, setState] = useState<SFuelState>({
    sFuelOk: true,
    isMining: false,
    chainsWithFaucet: [] as string[],
    totalChainsWithStation: 0,
    chainsWithEnoughSFuel: 0,
    currentAddress: null,
    loading: true,
    intervalId: null
  })

  const checkFaucetAvailability = useCallback(async () => {
    const chainsWithFaucet = await Promise.all(
      mpc.config.chains
        .map(async (chain) => {
          const station = new Station(chain, mpc)
          return (await station.isFaucetAvailable()) ? chain : null
        })
    ).then((chains) => chains.filter((chain): chain is string => chain !== null))
    setState((prev) => ({
      ...prev,
      chainsWithFaucet,
      totalChainsWithStation: chainsWithFaucet.length
    }))
  }, [mpc.config.chains, mpc.config.skaleNetwork])

  const checkSFuelBalance = useCallback(
    async (currentAddress: types.AddressType): Promise<void> => {
      if (!currentAddress || state.chainsWithFaucet.length === 0) return
      if (state.currentAddress !== currentAddress) {
        setState((prev) => ({ ...prev, currentAddress, loading: true }))
      }
      let chainsWithEnoughSFuel = 0
      let sFuelOk = true
      for (const chain of state.chainsWithFaucet) {
        const { balance } = await new Station(chain, mpc).getData(currentAddress)
        if (balance >= DEFAULT_MIN_SFUEL_WEI) {
          chainsWithEnoughSFuel++
        } else {
          sFuelOk = false
        }
      }
      setState((prev) => ({ ...prev, sFuelOk, chainsWithEnoughSFuel, loading: false }))
    },
    [state.chainsWithFaucet, mpc]
  )

  const mineSFuel = useCallback(async () => {
    if (!address) return
    setState((prev) => ({ ...prev, isMining: true }))
    let errorOccurred = false
    let chainsWithEnoughSFuel = 0

    for (const chain of state.chainsWithFaucet) {
      try {
        const station = new Station(chain, mpc)
        const { balance } = await station.getData(address)
        if (balance < DEFAULT_MIN_SFUEL_WEI) {
          log.info(`Mining sFuel on chain ${chain}`)
          const powResult = await station.doPoW(address)
          if (!powResult.ok) {
            log.error(`Failed to mine sFuel on chain ${chain}: ${powResult.message}`)
            errorOccurred = true
          } else {
            chainsWithEnoughSFuel++
          }
        } else {
          chainsWithEnoughSFuel++
        }
      } catch (error) {
        log.error(`Error processing chain ${chain}:`, error)
        errorOccurred = true
      }
      setState((prev) => ({
        ...prev,
        chainsWithEnoughSFuel
      }))
    }

    if (errorOccurred) {
      log.error('sFuel mining encountered errors on one or more chains')
    } else {
      log.info('sFuel mining completed successfully on all required chains')
    }

    setState((prev) => ({
      ...prev,
      sFuelOk: !errorOccurred,
      isMining: false,
      chainsWithEnoughSFuel
    }))
  }, [address, state.chainsWithFaucet, mpc])

  useEffect(() => {
    checkFaucetAvailability()
  }, [checkFaucetAvailability])

  useEffect(() => {
    const checkAndSetInterval = async () => {
      if (address !== state.currentAddress && state.intervalId) {
        clearInterval(state.intervalId)
        setState((prev) => ({
          ...prev,
          intervalId: null
        }))
      }
      if (address) {
        await checkSFuelBalance(address)
        setState((prev) => ({ ...prev, intervalId: newIntervalId }))
        const newIntervalId = setInterval(checkSFuelBalance, SFUEL_CHECK_INTERVAL)
      } else {
        setState((prev) => ({
          ...prev,
          sFuelOk: true,
          chainsWithEnoughSFuel: 0,
          isChecking: false,
          currentAddress: null,
          intervalId: null
        }))
      }
    }
    checkAndSetInterval()
    return () => {
      if (state.intervalId) {
        clearInterval(state.intervalId)
      }
    }
  }, [address, checkSFuelBalance])

  const sFuelCompletionPercentage = useMemo(() => {
    if (state.totalChainsWithStation === 0) return 100
    return Math.round((state.chainsWithEnoughSFuel / state.totalChainsWithStation) * 100)
  }, [state.chainsWithEnoughSFuel, state.totalChainsWithStation])

  return {
    ...state,
    mineSFuel,
    totalChainsWithStation: state.chainsWithFaucet.length,
    chainsWithEnoughSFuel: state.chainsWithEnoughSFuel,
    sFuelCompletionPercentage
  }
}
