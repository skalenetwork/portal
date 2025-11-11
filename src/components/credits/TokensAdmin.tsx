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
 * @file CreditTokensAdmin.tsx
 * @copyright SKALE Labs 2025-Present
 */

import { Contract, ethers } from 'ethers'
import { useEffect, useState } from 'react'

import { cmn, cls, type MetaportCore, SkPaper } from '@skalenetwork/metaport'
import { types } from '@/core'
import * as cs from '../../core/credit-station'

import GeneratingTokensRoundedIcon from '@mui/icons-material/GeneratingTokensRounded'
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded'
import EvStationRoundedIcon from '@mui/icons-material/EvStationRounded'

import TokenAdminTile from './TokenAdminTile'
import AccordionSection from '../AccordionSection'
import ErrorTile from '../ErrorTile'
import CreditsHistoryTile from './CreditsHistoryTile'
import CreditStationStatusTile from './CreditStationStatusTile'
import { getTokenPrices, getLedgerContract } from '../../core/credit-station'

interface CreditTokensAdminProps {
  mpc: MetaportCore
  creditStation: Contract | undefined
  isXs: boolean
  schains: types.ISChain[]
  chainsMeta: types.ChainsMetadataMap
}

const CreditTokensAdmin: React.FC<CreditTokensAdminProps> = ({
  mpc,
  creditStation,
  isXs,
  schains,
  chainsMeta
}) => {
  const tokens = mpc.config.connections.mainnet?.erc20
  const tokensMeta = mpc.config.tokens

  const [errorMsg, setErrorMsg] = useState<string | undefined>(undefined)
  const [tokenPrices, setTokenPrices] = useState<Record<string, bigint>>({})
  const [allPayments, setAllPayments] = useState<cs.PaymentEvent[]>([])
  const [ledgerContracts, setLedgerContracts] = useState<{ [schainName: string]: Contract }>({})
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const creditsHistory = allPayments
    .map((payment) => {
      const schain = schains.find((s) => {
        const schainHash = ethers.solidityPackedKeccak256(['string'], [s.name])
        return schainHash.toLowerCase() === payment.schainHash.toLowerCase()
      })
      return {
        schainName: schain?.name || '',
        payment
      }
    })
    .filter((item) => item.schainName !== '')
    .sort((a, b) => b.payment.blockNumber - a.payment.blockNumber)

  useEffect(() => {
    loadTokenPrices()
    loadAllPayments()
    initLedgerContracts()
  }, [creditStation])

  async function initLedgerContracts() {
    if (!schains.length) return
    const results = await Promise.all(
      schains.map(async (schain) => [schain.name, await getLedgerContract(mpc, schain.name)])
    )
    setLedgerContracts(
      Object.fromEntries(results.filter(([_, contract]) => contract !== undefined))
    )
  }

  async function loadAllPayments() {
    setIsLoading(true)
    const events = await cs.getAllPaymentEvents(creditStation)
    setAllPayments(events)
    setIsLoading(false)
  }

  async function loadTokenPrices() {
    const res = await getTokenPrices(creditStation)
    setTokenPrices(res || {})
  }

  if (!tokens) return <div>No tokens available</div>

  return (
    <div>
      <ErrorTile errorMsg={errorMsg} className={cls(cmn.mbott10)} />
      <SkPaper gray className={cls(cmn.mtop20)}>
        <AccordionSection
          expandedByDefault={true}
          title="Manage Credit Station"
          icon={<EvStationRoundedIcon />}
          marg={false}
        >
          <CreditStationStatusTile
            mpc={mpc}
            creditStation={creditStation}
            setErrorMsg={setErrorMsg}
          />
        </AccordionSection>
      </SkPaper>
      <SkPaper gray className={cls(cmn.mtop20)}>
        <AccordionSection
          expandedByDefault={true}
          title="Manage Credit Tokens"
          icon={<GeneratingTokensRoundedIcon />}
          marg={false}
        >
          <div className={cls(cmn.mtop10)}>
            {Object.entries(tokens).map(([symbol, tokenData]) => (
              <TokenAdminTile
                key={symbol}
                mpc={mpc}
                tokenPrices={tokenPrices}
                loadTokenPrices={loadTokenPrices}
                creditStation={creditStation}
                tokenMeta={tokensMeta[symbol]}
                tokenData={tokenData}
                symbol={symbol}
                isXs={isXs}
                setErrorMsg={setErrorMsg}
              />
            ))}
          </div>
        </AccordionSection>
      </SkPaper>
      <SkPaper gray className={cls(cmn.mtop20)}>
        <AccordionSection
          expandedByDefault={true}
          title="Purchases History"
          icon={<HistoryRoundedIcon />}
          marg={false}
        >
          <div className={cls(cmn.mtop10)}>
            {isLoading && (
              <div className={cls(cmn.pCent, cmn.mtop20, cmn.mbott20)}>
                <p className={cls(cmn.p, cmn.p3, cmn.pSec)}>Loading purchases history...</p>
              </div>
            )}
            {!isLoading && creditsHistory.length === 0 && (
              <div className={cls(cmn.mtop20)}>
                <HistoryRoundedIcon className={cls(cmn.pSec, cmn.fullWidth)} />
                <h5 className={cls(cmn.p, cmn.p600, cmn.pSec, cmn.pCent, cmn.mtop5, cmn.mbott20)}>
                  No purchases found
                </h5>
              </div>
            )}
            {!isLoading &&
              creditsHistory.map((item) => (
                <CreditsHistoryTile
                  key={`${item.schainName}-${item.payment.id}`}
                  creditsPurchase={item}
                  isXs={isXs}
                  mpc={mpc}
                  chainsMeta={chainsMeta}
                  tokenPrices={tokenPrices}
                  ledgerContract={ledgerContracts[item.schainName]}
                  creditStation={creditStation}
                  isAdmin={true}
                  setErrorMsg={setErrorMsg}
                />
              ))}
          </div>
        </AccordionSection>
      </SkPaper>
    </div>
  )
}

export default CreditTokensAdmin
