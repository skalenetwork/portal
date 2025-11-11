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

import { Contract } from 'ethers'
import { useEffect, useState } from 'react'

import { cmn, cls, type MetaportCore, SkPaper } from '@skalenetwork/metaport'

import GeneratingTokensRoundedIcon from '@mui/icons-material/GeneratingTokensRounded'
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded'

import TokenAdminTile from './TokenAdminTile'
import AccordionSection from '../AccordionSection'
import ErrorTile from '../ErrorTile'
import { getTokenPrices } from '../../core/credit-station'

interface CreditTokensAdminProps {
  mpc: MetaportCore
  creditStation: Contract | undefined
  isXs: boolean
}

const CreditTokensAdmin: React.FC<CreditTokensAdminProps> = ({ mpc, creditStation, isXs }) => {
  const tokens = mpc.config.connections.mainnet?.erc20
  const tokensMeta = mpc.config.tokens

  const [errorMsg, setErrorMsg] = useState<string | undefined>(undefined)
  const [tokenPrices, setTokenPrices] = useState<Record<string, bigint>>({})

  useEffect(() => {
    loadTokenPrices()
  }, [creditStation])

  async function loadTokenPrices() {
    const res = await getTokenPrices(creditStation)
    setTokenPrices(res || {})
  }

  if (!tokens) return <div>No tokens available</div>

  return (
    <div>
      <SkPaper gray className={cls(cmn.mtop20)}>
        <AccordionSection
          expandedByDefault={true}
          title="Manage Credit Tokens"
          icon={<GeneratingTokensRoundedIcon />}
          marg={false}
        >
          <div className={cls(cmn.mtop10)}>
            <ErrorTile errorMsg={errorMsg} className={cls(cmn.mbott10)} />
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
            !!!
          </div>
        </AccordionSection>
      </SkPaper>
    </div>
  )
}

export default CreditTokensAdmin
