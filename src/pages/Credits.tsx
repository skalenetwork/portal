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
 * @file Credits.tsx
 * @copyright SKALE Labs 2025-Present
 */

import { Helmet } from 'react-helmet'

import { useState, useEffect } from 'react'

import { Contract } from 'ethers'

import { cmn, cls, type MetaportCore, SkPaper, Tile, styles } from '@skalenetwork/metaport'
import { constants, dc, type types } from '@/core'
import * as cs from '../core/credit-station'

import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import CircularProgress from '@mui/material/CircularProgress'
import { Collapse } from '@mui/material'

import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded'
import HourglassBottomRoundedIcon from '@mui/icons-material/HourglassBottomRounded'
import LinkRoundedIcon from '@mui/icons-material/LinkRounded'
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded'

import { META_TAGS } from '../core/meta'
import SkPageInfoIcon from '../components/SkPageInfoIcon'
import AccordionSection from '../components/AccordionSection'
import SkStack from '../components/SkStack'
import ConnectWallet from '../components/ConnectWallet'
import ChainCreditsTile from '../components/credits/ChainCreditsTile'
import CreditsHistoryTile from '../components/credits/CreditsHistoryTile'
import { getCreditStation, getTokenPrices } from '../core/credit-station'
import ErrorTile from '../components/ErrorTile'

interface CreditsProps {
  mpc: MetaportCore
  address: types.AddressType | undefined
  isXs: boolean
  loadData: () => Promise<void>
  schains: types.ISChain[]
  chainsMeta: types.ChainsMetadataMap
}

const Credits: React.FC<CreditsProps> = ({ mpc, address, isXs, loadData, schains, chainsMeta }) => {
  const [_, setIntervalId] = useState<NodeJS.Timeout>()
  const [creditStation, setCreditStation] = useState<Contract | undefined>(undefined)
  const [tokenPrices, setTokenPrices] = useState<Record<string, bigint>>({})
  const [tokenBalances, setTokenBalances] = useState<types.mp.TokenBalancesMap>()
  const [tokenContracts, setTokenContracts] = useState<types.mp.TokenContractsMap>({})
  const [errorMsg, setErrorMsg] = useState<string | undefined>(undefined)
  const [allPayments, setAllPayments] = useState<Record<string, cs.PaymentEvent[]>>({})
  const [lastBlocks, setLastBlocks] = useState<Record<string, number>>({})

  const creditsHistory = Object.entries(allPayments)
    .flatMap(([schainName, payments]) =>
      payments.map((p) => ({
        schainName,
        payment: p
      }))
    )
    .sort((a, b) => b.payment.blockNumber - a.payment.blockNumber)

  async function loadPayments(isUpdate = false) {
    if (!creditStation || !address || schains.length === 0) return

    const paymentsMap: Record<string, cs.PaymentEvent[]> = {}
    const blocksMap: Record<string, number> = {}

    for (const schain of schains) {
      const startBlock =
        isUpdate && lastBlocks[schain.name] ? lastBlocks[schain.name] + 1 : undefined
      const events = await cs.getPaymentEvents(creditStation, address, startBlock)

      if (isUpdate) {
        paymentsMap[schain.name] = [...(allPayments[schain.name] || []), ...events]
      } else {
        paymentsMap[schain.name] = events
      }

      if (events.length > 0) {
        blocksMap[schain.name] = Math.max(...events.map((p) => p.blockNumber))
      } else if (lastBlocks[schain.name]) {
        blocksMap[schain.name] = lastBlocks[schain.name]
      }
    }

    setAllPayments(paymentsMap)
    setLastBlocks(blocksMap)
  }

  async function initCreditStation() {
    setCreditStation(await getCreditStation(mpc))
  }

  async function loadCreditStationData() {
    setTokenPrices((await getTokenPrices(creditStation)) || {})
    if (address) {
      setTokenBalances(await mpc.tokenBalances(tokenContracts, address))
    }
  }

  async function initTokenContracts() {
    const tokens = mpc.config.connections.mainnet?.erc20
    const contracts: Record<string, Contract> = {}
    const provider = mpc.provider(constants.MAINNET_CHAIN_NAME)
    for (const [symbol, _] of Object.entries(tokens)) {
      const ct = mpc.tokenContract(
        constants.MAINNET_CHAIN_NAME,
        symbol,
        dc.TokenType.erc20,
        provider
      )
      if (ct) contracts[symbol] = ct
    }
    setTokenContracts(contracts)
  }

  useEffect(() => {
    loadData()
    initTokenContracts()
    loadCreditStationData()
    initCreditStation()
  }, [])

  useEffect(() => {
    loadCreditStationData()
  }, [address, tokenContracts])

  useEffect(() => {
    if (creditStation) {
      const intervalId = setInterval(loadCreditStationData, 10000)
      setIntervalId(intervalId)
    }
    loadCreditStationData()
  }, [creditStation])

  useEffect(() => {
    if (creditStation && address && schains.length > 0) {
      loadPayments(false)
      const interval = setInterval(() => loadPayments(true), 30000)
      return () => clearInterval(interval)
    }
  }, [creditStation, address])

  if (schains.length === 0) {
    return (
      <div className="fullscreen-msg">
        <div className={cls(cmn.flex)}>
          <div className={cls(cmn.flex, cmn.flexcv, cmn.mri20)}>
            <CircularProgress className="fullscreen-spin" />
          </div>
          <div className={cls(cmn.flex, cmn.flexcv)}>
            <h3 className="fullscreen-msg-text">Loading credits info</h3>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Container maxWidth="md" className={cls(cmn.mbott20)}>
      <Helmet>
        <title>{META_TAGS.credits.title}</title>
        <meta name="description" content={META_TAGS.credits.description} />
        <meta property="og:title" content={META_TAGS.credits.title} />
        <meta property="og:description" content={META_TAGS.credits.description} />
      </Helmet>
      <Stack spacing={0}>
        <div className={cls(cmn.flex, cmn.flexcv)}>
          <div className={cmn.flexg}>
            <h2 className={cls(cmn.nom)}>Chain Credits</h2>
            <p className={cls(cmn.nom, cmn.p, cmn.p3, cmn.pSec)}>
              Manage your SKALE Chain Credits - purchase and view balances.
            </p>
          </div>
          <SkPageInfoIcon meta_tag={META_TAGS.credits} />
        </div>

        <ErrorTile errorMsg={errorMsg} className={cls(cmn.mbott10)} />

        <SkPaper gray className={cls(cmn.mtop20)}>
          <AccordionSection
            expandedByDefault={true}
            title="Chains"
            icon={<LinkRoundedIcon />}
            marg={false}
          >
            <Collapse in={address !== undefined}>
              {schains.map((schain) => (
                <ChainCreditsTile
                  key={schain.name}
                  mpc={mpc}
                  chainsMeta={chainsMeta}
                  schain={schain}
                  isXs={isXs}
                  creditStation={creditStation}
                  tokenPrices={tokenPrices}
                  tokenBalances={tokenBalances}
                  setErrorMsg={setErrorMsg}
                />
              ))}
            </Collapse>
            <Collapse in={address === undefined}>
              <ConnectWallet
                tile
                className={cls(cmn.flexg, cmn.mtop10)}
                customText="Connect your wallet to buy credits"
              />
            </Collapse>
          </AccordionSection>
        </SkPaper>
        <SkPaper gray className={cls(cmn.mtop20)}>
          <AccordionSection
            expandedByDefault={true}
            title="History"
            icon={<HistoryRoundedIcon />}
            marg={false}
          >
            <Collapse in={creditsHistory.length !== 0 && address !== undefined}>
              {creditsHistory.map((item) => (
                <CreditsHistoryTile
                  key={`${item.schainName}-${item.payment.id}`}
                  creditsPurchase={item}
                  isXs={isXs}
                  mpc={mpc}
                  chainsMeta={chainsMeta}
                  tokenPrices={tokenPrices}
                />
              ))}
            </Collapse>
            <Collapse in={creditsHistory.length === 0 && address !== undefined}>
              <div className={cls(cmn.mtop20)}>
                <HistoryRoundedIcon className={cls(cmn.pSec, styles.chainIconmd, cmn.fullWidth)} />
                <h5 className={cls(cmn.p, cmn.p600, cmn.pSec, cmn.pCent, cmn.mtop5, cmn.mbott20)}>
                  No past purchases found
                </h5>
              </div>
            </Collapse>
            <Collapse in={address === undefined}>
              <div className={cls(cmn.mtop20)}>
                <HistoryRoundedIcon className={cls(cmn.pSec, styles.chainIconmd, cmn.fullWidth)} />
                <h5 className={cls(cmn.p, cmn.p600, cmn.pSec, cmn.pCent, cmn.mtop5, cmn.mbott20)}>
                  Connect your wallet to view credits history
                </h5>
              </div>
            </Collapse>
          </AccordionSection>
        </SkPaper>

        <div className={cls(cmn.mbott20, cmn.mtop20)}></div>
      </Stack>
    </Container>
  )
}

export default Credits
