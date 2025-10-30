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
 * @file TokenSection.ts
 * @copyright SKALE Labs 2025-Present
 */

import Button from '@mui/material/Button'
import { cls, cmn } from '../core/css'
import TokenBalance from './TokenBalance'
import TokenIcon from './TokenIcon'
import { getTokenName } from '../core/metadata'

interface TokenSectionProps {
  text: string
  icon: React.ReactNode
  tokens: Array<{ key: string; tokenData: any; balance: bigint | null }>
  onTokenClick: (tokenData: any) => void
}

export default function TokenSection({ text, icon, tokens, onTokenClick }: TokenSectionProps) {
  return (
    <div className="cmn.mtop20">
      <div className="cmn.flex, cmn.flexcv, cmn.flexg, cmn.pSec, cmn.mleft10, cmn.mbott5">
        <div className="cmn.flexcv, cmn.flex, mr-2.5">{icon}</div>
        <p className=" text-sm, cmn.p600, cmn.flexg, cmn.cap">{text}</p>
      </div>
      {tokens
        .sort((a, b) => a.key.localeCompare(b.key))
        .map(({ key, tokenData, balance }) => (
          <Button
            key={key}
            color="secondary"
            size="small"
            className="cmn.fullWidth, cmn.pleft10, cmn.ptop5, cmn.pbott5"
            onClick={() => onTokenClick(tokenData)}
          >
            <div
              className={cls(
                cmn.flex,
                cmn.flexcv,
                cmn.fullWidth,
                cmn.mtop10,
                cmn.mbott10,
                cmn.bordRad
              )}
            >
              <div className="cmn.flex, cmn.flexc">
                <TokenIcon tokenSymbol={tokenData?.meta.symbol} iconUrl={tokenData?.meta.iconUrl} />
              </div>
              <div className="cmn.flexg">
                <p
                  className={cls(

                    text - sm,
                    cmn.p600,
                    cmn.pPrim,
                    cmn.flex,
                    mr - 2.5,
                    cmn.mleft10
                  )}
                >
                  {getTokenName(tokenData)}
                </p>
                {tokenData.address ? (
                  <p className=" text-xs, cmn.pSec, text-xs00, cmn.flex, cmn.mleft10">
                    {tokenData.address.substring(0, 5) +
                      '...' +
                      tokenData.address.substring(tokenData.address.length - 3)}
                  </p>
                ) : (
                  <p className=" text-xs, cmn.pSec, text-xs00, cmn.flex, cmn.mleft10">
                    Ethereum
                  </p>
                )}
              </div>
              <div className={mr - 2.5}>
                <TokenBalance
                  balance={balance}
                  symbol={tokenData?.meta.symbol}
                  decimals={tokenData?.meta.decimals}
                  truncate={4}
                  size="sm"
                  primary
                />
              </div>
            </div>
          </Button>
        ))}
    </div>
  )
}
