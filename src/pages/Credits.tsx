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

import { useState, useEffect, useMemo } from 'react'

import { Contract } from 'ethers'

import { type MetaportCore, SkPaper } from '@skalenetwork/metaport'
import { contracts as coreContracts, dc, type types } from '@/core'
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
import ErrorTile from '../components/ErrorTile'
import { History, HistoryIcon, Link2 } from 'lucide-react'

interface CreditsProps {
  mpc: MetaportCore
  address: types.AddressType | undefined
  loadData: () => Promise<void>
  schains: types.ISChain[]
  chainsMeta: types.ChainsMetadataMap
}

const Credits: React.FC<CreditsProps> = ({ mpc, address, loadData, schains, chainsMeta }) => {
  const [creditStationBySource, setCreditStationBySource] = useState<Record<string, Contract>>({})
  const [tokenPricesBySource, setTokenPricesBySource] = useState<
    Record<string, Record<string, bigint>>
  >({})
  const [tokenBalancesBySource, setTokenBalancesBySource] = useState<
    Record<string, types.mp.TokenBalancesMap | undefined>
  >({})
  const [tokenContractsBySource, setTokenContractsBySource] = useState<
    Record<string, types.mp.TokenContractsMap>
  >({})
  const [ledgerContracts, setLedgerContracts] = useState<{ [schainName: string]: Contract }>({})
  const [errorMsg, setErrorMsg] = useState<string | undefined>(undefined)
  const [payments, setPayments] = useState<cs.Payment[]>([])

  const sources = useMemo(
    () => cs.getCreditStationSources(mpc.config.skaleNetwork),
    [mpc]
  )

  const sourceById = useMemo<Record<string, coreContracts.CreditStationSource>>(
    () => Object.fromEntries(sources.map((s) => [s.id, s])),
    [sources]
  )

  async function loadPayments() {
    if (Object.keys(creditStationBySource).length === 0 || !address || schains.length === 0) return
    setPayments(
      await cs.getPaymentsAcrossSourcesByAddress(creditStationBySource, address, schains)
    )
  }

  async function initCreditStations() {
    setCreditStationBySource(await cs.initAllCreditStations(mpc, sources))
  }

  async function loadTokenPrices() {
    if (Object.keys(creditStationBySource).length === 0) return
    setTokenPricesBySource(await cs.getTokenPricesBySource(creditStationBySource))
  }

  async function loadTokenBalances() {
    if (!address) return
    const entries = await Promise.all(
      sources.map(async (source) => {
        const contracts = tokenContractsBySource[source.id]
        if (!contracts) return [source.id, undefined] as const
        try {
          const balances = await mpc.tokenBalances(contracts, address)
          return [source.id, balances] as const
        } catch (error) {
          console.error(`Failed to load balances for ${source.id}:`, error)
          return [source.id, undefined] as const
        }
      })
    )
    setTokenBalancesBySource(Object.fromEntries(entries))
  }

  async function initTokenContracts() {
    const result: Record<string, types.mp.TokenContractsMap> = {}
    for (const source of sources) {
      const tokens = mpc.config.connections[source.chainName]?.erc20 ?? {}
      const contracts: types.mp.TokenContractsMap = {}
      let provider
      try {
        provider = mpc.provider(source.chainName)
      } catch (error) {
        console.error(`Failed to get provider for ${source.chainName}:`, error)
        continue
      }
      for (const symbol of Object.keys(tokens)) {
        const ct = mpc.tokenContract(source.chainName, symbol, dc.TokenType.erc20, provider)
        if (ct) contracts[symbol] = ct
      }
      result[source.id] = contracts
    }
    setTokenContractsBySource(result)
  }

  async function initLedgerContracts() {
    setLedgerContracts(await cs.initAllLedgerContracts(mpc, schains))
  }

  useEffect(() => {
    loadData()
    initTokenContracts()
    initCreditStations()
  }, [])

  useEffect(() => {
    loadTokenBalances()
  }, [address, tokenContractsBySource])

  useEffect(() => {
    initLedgerContracts()
  }, [schains])

  useEffect(() => {
    loadTokenPrices()
    loadTokenBalances()
    if (Object.keys(creditStationBySource).length === 0) return
    const intervalId = setInterval(() => {
      loadTokenPrices()
      loadTokenBalances()
    }, 10000)
    return () => clearInterval(intervalId)
  }, [creditStationBySource])

  useEffect(() => {
    if (Object.keys(creditStationBySource).length > 0 && address && schains.length > 0) {
      loadPayments()
      const interval = setInterval(loadPayments, 30000)
      return () => clearInterval(interval)
    }
  }, [creditStationBySource, address, schains])

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

  const sortedPayments = [...payments].sort((a, b) => {
    if (b.timestamp !== a.timestamp) return b.timestamp - a.timestamp
    return Number(b.id - a.id)
  })

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
                  sources={sources}
                  creditStationBySource={creditStationBySource}
                  tokenPricesBySource={tokenPricesBySource}
                  tokenBalancesBySource={tokenBalancesBySource}
                  setErrorMsg={setErrorMsg}
                  onPurchase={loadPayments}
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
            <Collapse in={sortedPayments.length !== 0 && address !== undefined} className="-mb-2">
              {sortedPayments.map((payment: cs.Payment) => (
                <CreditsPaymentTile
                  key={`${payment.sourceId}-${payment.schainName}-${payment.id}`}
                  payment={payment}
                  mpc={mpc}
                  chainsMeta={chainsMeta}
                  ledgerContract={ledgerContracts[payment.schainName]}
                  source={sourceById[payment.sourceId]}
                  setErrorMsg={setErrorMsg}
                />
              ))}
            </Collapse>
            <Collapse in={sortedPayments.length === 0 && address !== undefined}>
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
