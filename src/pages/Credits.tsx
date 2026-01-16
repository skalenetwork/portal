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

import { type MetaportCore, SkPaper } from '@skalenetwork/metaport'
import { constants, dc, type types } from '@/core'
import * as cs from '../core/credit-station'

import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import CircularProgress from '@mui/material/CircularProgress'
import { Collapse } from '@mui/material'

import { META_TAGS } from '../core/meta'
import SkPageInfoIcon from '../components/SkPageInfoIcon'
import AccordionSection from '../components/AccordionSection'
import ConnectWallet from '../components/ConnectWallet'
import ChainCreditsTile from '../components/credits/ChainCreditsTile'
import CreditsPaymentTile from '../components/credits/CreditsPaymentTile'
import { getCreditStation, getTokenPrices } from '../core/credit-station'
import ErrorTile from '../components/ErrorTile'
import { History, HistoryIcon, Link2 } from 'lucide-react'

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
  const [ledgerContracts, setLedgerContracts] = useState<{ [schainName: string]: Contract }>({})
  const [errorMsg, setErrorMsg] = useState<string | undefined>(undefined)
  const [payments, setPayments] = useState<cs.Payment[]>([])

  async function loadPayments() {
    if (!creditStation || !address || schains.length === 0) return
    setPayments(await cs.getPaymentsByAddress(creditStation, address, schains))
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

  async function initLedgerContracts() {
    const results = await Promise.all(
      schains.map(async (schain) => [schain.name, await cs.getLedgerContract(mpc, schain.name)])
    )
    setLedgerContracts(
      Object.fromEntries(results.filter(([_, contract]) => contract !== undefined))
    )
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
    initLedgerContracts()
  }, [schains])

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
        <div className="flex">
          <div className="flex items-center mr-5">
            <CircularProgress className="fullscreen-spin" />
          </div>
          <div className="flex items-center">
            <h3 className="fullscreen-msg-text font-semibold text-foreground">
              Loading credits info
            </h3>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Container maxWidth="md" className="mb-5">
      <Helmet>
        <title>{META_TAGS.credits.title}</title>
        <meta name="description" content={META_TAGS.credits.description} />
        <meta property="og:title" content={META_TAGS.credits.title} />
        <meta property="og:description" content={META_TAGS.credits.description} />
      </Helmet>
      <Stack spacing={0}>
        <div className="flex items-center">
          <div className="grow">
            <h2 className="m-0 text-xl font-bold text-foreground">Chain Credits</h2>
            <p className="text-xs text-secondary-foreground font-semibold">
              Manage your SKALE Chain Credits - purchase and view balances
            </p>
          </div>
          <SkPageInfoIcon meta_tag={META_TAGS.credits} />
        </div>
        <ErrorTile errorMsg={errorMsg} className="mb-2.5" />
        <SkPaper gray className="mt-5">
          <AccordionSection
            expandedByDefault={true}
            title="Chains"
            icon={<Link2 size={17} />}
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
                className="grow mt-2.5"
                customText="Connect your wallet to buy credits"
              />
            </Collapse>
          </AccordionSection>
        </SkPaper>
        <SkPaper gray className="mt-5">
          <AccordionSection
            expandedByDefault={true}
            title="History"
            icon={<History size={17} />}
            marg={false}
          >
            <Collapse in={payments.length !== 0 && address !== undefined} className="-mb-2">
              {[...payments].reverse().map((payment: cs.Payment) => (
                <CreditsPaymentTile
                  key={`${payment.schainName}-${payment.id}`}
                  payment={payment}
                  isXs={isXs}
                  mpc={mpc}
                  chainsMeta={chainsMeta}
                  ledgerContract={ledgerContracts[payment.schainName]}
                  creditStation={creditStation}
                />
              ))}
            </Collapse>
            <Collapse in={payments.length === 0 && address !== undefined}>
              <div className="mt-5">
                <div className="flex items-center justify-center mb-4">
                  <HistoryIcon size={27} className="text-muted-foreground" />
                </div>
                <h5 className="p font-semibold text-sm text-muted-foreground text-center mb-5">
                  No past purchases found
                </h5>
              </div>
            </Collapse>
            <Collapse in={address === undefined}>
              <div className="mt-5">
                <div className="flex items-center justify-center mb-4">
                  <HistoryIcon size={27} className="text-muted-foreground" />
                </div>
                <h5 className="p font-semibold text-sm text-muted-foreground text-center mb-5">
                  Connect your wallet to view credits history
                </h5>
              </div>
            </Collapse>
          </AccordionSection>
        </SkPaper>
      </Stack>
    </Container>
  )
}

export default Credits
