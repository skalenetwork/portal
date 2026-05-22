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
 * @file CreditsAdmin.tsx
 * @copyright SKALE Labs 2025-Present
 */

import { Helmet } from 'react-helmet'

import { useState, useEffect, useMemo } from 'react'

import { Contract } from 'ethers'

import { type MetaportCore, SkPaper } from '@skalenetwork/metaport'
import { contracts as coreContracts, type types } from '@/core'
import * as cs from '../core/credit-station'

import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import CircularProgress from '@mui/material/CircularProgress'
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded'
import { History } from 'lucide-react'

import { META_TAGS } from '../core/meta'
import SkPageInfoIcon from '../components/SkPageInfoIcon'
import AccordionSection from '../components/AccordionSection'
import ErrorTile from '../components/ErrorTile'
import TokensAdmin from '../components/credits/TokensAdmin'
import CreditsPaymentTile from '../components/credits/CreditsPaymentTile'

interface CreditsAdminProps {
  mpc: MetaportCore
  address: types.AddressType | undefined
  loadData: () => Promise<void>
  schains: types.ISChain[]
  chainsMeta: types.ChainsMetadataMap
}

const CreditsAdmin: React.FC<CreditsAdminProps> = ({
  mpc,
  loadData,
  schains,
  chainsMeta
}) => {
  const [creditStationBySource, setCreditStationBySource] = useState<Record<string, Contract>>({})
  const [ledgerContracts, setLedgerContracts] = useState<{ [schainName: string]: Contract }>({})
  const [allPayments, setAllPayments] = useState<cs.Payment[]>([])
  const [errorMsg, setErrorMsg] = useState<string | undefined>(undefined)
  const [isLoadingPayments, setIsLoadingPayments] = useState<boolean>(false)

  const sources = useMemo(
    () => cs.getCreditStationSources(mpc.config.skaleNetwork),
    [mpc]
  )

  const sourceById = useMemo<Record<string, coreContracts.CreditStationSource>>(
    () => Object.fromEntries(sources.map((s) => [s.id, s])),
    [sources]
  )

  async function initCreditStations() {
    setCreditStationBySource(await cs.initAllCreditStations(mpc, sources))
  }

  async function initLedgerContracts() {
    if (!schains.length) return
    setLedgerContracts(await cs.initAllLedgerContracts(mpc, schains))
  }

  async function loadAllPayments() {
    if (Object.keys(creditStationBySource).length === 0) return
    setIsLoadingPayments(true)
    try {
      setAllPayments(await cs.getAllPaymentsAcrossSources(creditStationBySource, schains))
    } finally {
      setIsLoadingPayments(false)
    }
  }

  useEffect(() => {
    loadData()
    initCreditStations()
    const intervalId = setInterval(loadData, 100000)
    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    initLedgerContracts()
  }, [schains])

  useEffect(() => {
    loadAllPayments()
  }, [creditStationBySource, schains])

  if (schains.length === 0 || sources.length === 0) {
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

  const sortedPayments = [...allPayments].sort((a, b) => {
    if (b.blockNumber !== a.blockNumber) return b.blockNumber - a.blockNumber
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
            <h2 className="m-0 text-xl font-bold text-foreground">Chain Credits Admin</h2>
            <p className="text-xs text-secondary-foreground font-semibold">
              Manage admin functions for SKALE Chain Credits
            </p>
          </div>
          <SkPageInfoIcon meta_tag={META_TAGS.credits} />
        </div>
        <ErrorTile errorMsg={errorMsg} className="mb-2.5 mt-2.5" />
        {sources.map((source) => (
          <TokensAdmin
            key={source.id}
            mpc={mpc}
            source={source}
            creditStation={creditStationBySource[source.id]}
            chainsMeta={chainsMeta}
            setErrorMsg={setErrorMsg}
          />
        ))}
        <SkPaper gray className="mt-5">
          <AccordionSection
            expandedByDefault={true}
            title="Purchases History"
            icon={<History size={17} />}
            marg={false}
          >
            <div className="mt-2.5">
              {isLoadingPayments && (
                <div className="text-center mt-5 mb-5">
                  <p className="p text-sm text-secondary-foreground font-semibold">
                    Loading purchases history...
                  </p>
                </div>
              )}
              {!isLoadingPayments && sortedPayments.length === 0 && (
                <div className="mt-5">
                  <HistoryRoundedIcon className="text-secondary w-full" />
                  <h5 className="p font-semibold text-secondary text-center mt-1.5 mb-5">
                    No purchases found
                  </h5>
                </div>
              )}
              {!isLoadingPayments &&
                sortedPayments.map((payment: cs.Payment) => (
                  <CreditsPaymentTile
                    key={`${payment.sourceId}-${payment.schainName}-${payment.id}`}
                    payment={payment}
                    mpc={mpc}
                    chainsMeta={chainsMeta}
                    ledgerContract={ledgerContracts[payment.schainName]}
                    creditStation={creditStationBySource[payment.sourceId]}
                    source={sourceById[payment.sourceId]}
                    isAdmin={true}
                    setErrorMsg={setErrorMsg}
                  />
                ))}
            </div>
          </AccordionSection>
        </SkPaper>
      </Stack>
    </Container>
  )
}

export default CreditsAdmin
