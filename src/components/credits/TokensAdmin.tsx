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
 * @file TokensAdmin.tsx
 * @copyright SKALE Labs 2025-Present
 */

import { Contract } from 'ethers'
import { useEffect, useState } from 'react'

import { type MetaportCore, SkPaper, ChainIcon } from '@skalenetwork/metaport'
import { contracts as coreContracts, metadata, types } from '@/core'

import TokenAdminTile from './TokenAdminTile'
import AccordionSection from '../AccordionSection'
import CreditStationStatusTile from './CreditStationStatusTile'
import { getTokenPrices } from '../../core/credit-station'
import { Coins, SwatchBook } from 'lucide-react'

interface TokensAdminProps {
  mpc: MetaportCore
  source: coreContracts.CreditStationSource
  creditStation: Contract | undefined
  chainsMeta: types.ChainsMetadataMap
  setErrorMsg: (msg: string | undefined) => void
}

const TokensAdmin: React.FC<TokensAdminProps> = ({
  mpc,
  source,
  creditStation,
  chainsMeta,
  setErrorMsg
}) => {
  const tokens = mpc.config.connections[source.chainName]?.erc20 ?? {}
  const tokensMeta = mpc.config.tokens
  const network = mpc.config.skaleNetwork
  const sourceAlias =
    metadata.getAlias(network, chainsMeta, source.chainName) || source.displayName

  const [tokenPrices, setTokenPrices] = useState<Record<string, bigint>>({})

  useEffect(() => {
    loadTokenPrices()
  }, [creditStation])

  async function loadTokenPrices() {
    const res = await getTokenPrices(creditStation)
    setTokenPrices(res || {})
  }

  return (
    <div>
      <div className="flex items-center gap-2 mt-7 mb-2 px-1 pt-1">
        <ChainIcon chainName={source.chainName} skaleNetwork={network} size="xs" />
        <h3 className="m-0 text-xl font-bold text-foreground">{sourceAlias}</h3>
      </div>
      <SkPaper gray className="mt-2.5">
        <AccordionSection
          expandedByDefault={true}
          title="Manage Credit Station"
          icon={<SwatchBook size={17} />}
          marg={false}
        >
          <CreditStationStatusTile
            mpc={mpc}
            creditStation={creditStation}
            source={source}
            setErrorMsg={(msg) => setErrorMsg(msg ?? undefined)}
          />
        </AccordionSection>
      </SkPaper>
      <SkPaper gray className="mt-5">
        <AccordionSection
          expandedByDefault={true}
          title="Manage Credit Tokens"
          icon={<Coins size={17} />}
          marg={false}
        >
          <div className="mt-2.5">
            {Object.keys(tokens).length === 0 && (
              <div className="text-center mt-5 mb-5">
                <p className="p text-sm text-secondary-foreground font-semibold">
                  No tokens configured for this source
                </p>
              </div>
            )}
            {Object.entries(tokens).map(([symbol, tokenData]: [string, types.mp.Token]) => (
              <TokenAdminTile
                key={symbol}
                mpc={mpc}
                tokenPrices={tokenPrices}
                loadTokenPrices={loadTokenPrices}
                creditStation={creditStation}
                source={source}
                tokenMeta={tokensMeta[symbol]}
                tokenData={tokenData}
                symbol={symbol}
                setErrorMsg={(msg) => setErrorMsg(msg ?? undefined)}
              />
            ))}
          </div>
        </AccordionSection>
      </SkPaper>
    </div>
  )
}

export default TokensAdmin
