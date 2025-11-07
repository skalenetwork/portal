/**
 * @license
 * SKALE Metaport
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * @file SFuelWarning.ts
 * @copyright SKALE Labs 2023-Present
 */

import { useEffect, useState } from 'react'
import { Logger, type ILogObj } from 'tslog'

import { constants } from '@/core'
import { useAccount } from 'wagmi'

import Button from '@mui/material/Button'
import { Collapse } from '@mui/material'
import LinearProgress from '@mui/material/LinearProgress'
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded'

import { BALANCE_UPDATE_INTERVAL_MS, SFUEL_TEXT } from '../core/constants'
import { Station } from '../core/sfuel'
import { isFaucetAvailable } from '../core/faucet'

import { useMetaportStore } from '../store/MetaportStore'
import { useSFuelStore } from '../store/SFuelStore'


const log = new Logger<ILogObj>({ name: 'metaport:components:SFuel' })

export default function SFuelWarning(props: {}) {
  const mpc = useMetaportStore((state) => state.mpc)
  const chainName1 = useMetaportStore((state) => state.chainName1)
  const chainName2 = useMetaportStore((state) => state.chainName2)
  const token = useMetaportStore((state) => state.token)

  const loading = useSFuelStore((state) => state.loading)
  const setLoading = useSFuelStore((state) => state.setLoading)
  const mining = useSFuelStore((state) => state.mining)
  const setMining = useSFuelStore((state) => state.setMining)

  const fromChainStation = useSFuelStore((state) => state.fromChainStation)
  const setFromChainStation = useSFuelStore((state) => state.setFromChainStation)

  const toChainStation = useSFuelStore((state) => state.toChainStation)
  const setToChainStation = useSFuelStore((state) => state.setToChainStation)

  const hubChainStation = useSFuelStore((state) => state.hubChainStation)
  const setHubChainStation = useSFuelStore((state) => state.setHubChainStation)

  const fromChainData = useSFuelStore((state) => state.fromChainData)
  const setFromChainData = useSFuelStore((state) => state.setFromChainData)

  const toChainData = useSFuelStore((state) => state.toChainData)
  const setToChainData = useSFuelStore((state) => state.setToChainData)

  const hubChainData = useSFuelStore((state) => state.hubChainData)
  const setHubChainData = useSFuelStore((state) => state.setHubChainData)

  const [refilledFlag, setRefilledFlag] = useState<boolean>(false)

  const { address } = useAccount()

  let hubChain

  if (token && chainName2 && token.connections[chainName2] && token.connections[chainName2].hub) {
    hubChain = token.connections[chainName2].hub
  }

  useEffect(() => {
    if (!chainName1 || !chainName2 || !address) return
    setLoading(true)
    setFromChainStation(null)
    setToChainStation(null)
    setHubChainStation(null)
    log.info('Initializing SFuelWarning', chainName1, chainName2, hubChain, address)
    createStations()
  }, [chainName1, chainName2, hubChain, address])

  useEffect(() => {
    updateStationsData()
    const intervalId = window.setInterval(() => {
      updateStationsData()
    }, BALANCE_UPDATE_INTERVAL_MS)
    return () => {
      window.clearInterval(intervalId)
    }
  }, [fromChainStation, toChainStation, hubChainStation])

  function createStations() {
    setFromChainStation(new Station(chainName1, mpc))
    setToChainStation(new Station(chainName2, mpc))
    if (hubChain) setHubChainStation(new Station(hubChain, mpc))
  }

  async function updateStationsData() {
    if (fromChainStation) {
      setFromChainData(await fromChainStation.getData(address))
    }
    if (toChainStation) {
      setToChainData(await toChainStation.getData(address))
      setLoading(false)
    }
    if (hubChainStation) {
      setHubChainData(await hubChainStation.getData(address))
    }
    if (refilledFlag) {
      setMining(false)
      setRefilledFlag(false)
    }
  }

  async function doPoW() {
    let fromPowRes
    let toPowRes
    let hubPowRes

    setMining(true)
    if (fromChainStation) {
      const fromData = await fromChainStation.getData(address)
      if (!fromData.ok) {
        log.info(`Doing PoW on ${fromChainStation.chainName}`)
        fromPowRes = await fromChainStation.doPoW(address)
      }
    }
    if (toChainStation) {
      const toData = await toChainStation.getData(address)
      if (!toData.ok) {
        log.info(`Doing PoW on ${toChainStation.chainName}`)
        toPowRes = await toChainStation.doPoW(address)
      }
    }
    if (hubChainStation) {
      const hubData = await hubChainStation.getData(address)
      if (!hubData.ok) {
        log.info(`Doing PoW on ${hubChainStation.chainName}`)
        hubPowRes = await hubChainStation.doPoW(address)
      }
    }
    if (
      (fromPowRes && !fromPowRes.ok) ||
      (toPowRes && !toPowRes.ok) ||
      (hubPowRes && !hubPowRes.ok)
    ) {
      log.info('PoW failed!')
      if (fromPowRes) log.info(chainName1, fromPowRes.message)
      if (toPowRes) log.info(chainName2, toPowRes.message)
      if (hubPowRes) log.info(hubChain, hubPowRes.message)
    }
    setRefilledFlag(true)
  }

  function getSFuelText() {
    return SFUEL_TEXT[noEth ? 'gas' : 'sfuel']['error']
  }

  if (loading && chainName2)
    return (
      <div className="ml-2.5 mr-2.5 mt-5 mb-2.5">
        <LinearProgress />
      </div>
    )

  const fromMainnet = chainName1 === constants.MAINNET_CHAIN_NAME
  const toMainnet = chainName2 === constants.MAINNET_CHAIN_NAME

  const fromFaucet = isFaucetAvailable(chainName1, mpc.config.skaleNetwork)
  const destFaucet = isFaucetAvailable(chainName2, mpc.config.skaleNetwork)
  const hubFaucet = isFaucetAvailable(hubChain, mpc.config.skaleNetwork) || !hubChain

  const fromOk = fromChainData && fromChainData.ok
  const toOk = toChainData && toChainData.ok
  const hubOk = (hubChainData && hubChainData.ok) || !hubChainData

  const isOk = fromOk && toOk && hubOk
  const sFuelBtn = (fromFaucet || fromMainnet) && (destFaucet || toMainnet) && hubFaucet
  const noEth = (fromMainnet && !fromOk) || (toMainnet && !toOk)

  return (
    <Collapse in={!loading && !isOk}>
      <div className="mt-5 mb-5">
        <p className="flex text-sm text-primary flex-grow ml-2.5">
          ⛽ {getSFuelText()}
        </p>
        {!sFuelBtn || noEth ? (
          <p
            className="flex text-sm text-primary flex-grow ml-2.5 mt-2.5"
          >
            ❗️ Faucet is not available for one of the selected chains
          </p>
        ) : (
          <div>
            {mining ? (
              <Button
                disabled
                startIcon={<ArrowOutwardRoundedIcon />}
                size="small"
                variant="contained"
                className="styles.btnAction, mt-2.5"
              >
                Getting sFUEL...
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                size="medium"
                className="styles.btnAction, mt-2.5"
                onClick={doPoW}
              >
                Get sFUEL
              </Button>
            )}
          </div>
        )}
      </div>
    </Collapse>
  )
}
