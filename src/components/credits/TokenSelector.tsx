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
 * @file TokenSelector.tsx
 * @copyright SKALE Labs 2025-Present
 */

import { useMemo } from 'react'
import { ButtonBase } from '@mui/material'
import { TokenIcon } from '@skalenetwork/metaport'
import { types, units } from '@/core'

interface TokenSelectorProps {
  tokens: Record<string, { address?: string }>
  tokensMeta: types.mp.TokenMetadataMap
  tokenPrices: Record<string, bigint>
  tokenBalances: types.mp.TokenBalancesMap | undefined
  selected: string | undefined
  onSelect: (symbol: string) => void
}

function formatBalance(
  balance: bigint | undefined,
  symbol: string,
  decimals: number
): string {
  if (balance === undefined) return '—'
  return units.displayBalance(balance, symbol, decimals)
}

export default function TokenSelector({
  tokens,
  tokensMeta,
  tokenPrices,
  tokenBalances,
  selected,
  onSelect
}: TokenSelectorProps) {
  const available = useMemo(
    () =>
      Object.entries(tokens)
        .filter(([, data]) => data.address && tokenPrices[data.address])
        .map(([symbol]) => symbol),
    [tokens, tokenPrices]
  )

  if (available.length === 0) {
    return (
      <div className="rounded-full bg-card px-4 py-2 text-sm font-semibold text-muted-foreground">
        No tokens
      </div>
    )
  }

  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-background p-1">
      {available.map((symbol) => {
        const decimals = tokensMeta[symbol]?.decimals ?? 18
        const balance = formatBalance(tokenBalances?.[symbol], symbol, decimals)
        const isSelected = symbol === selected
        return (
          <ButtonBase
            key={symbol}
            onClick={() => onSelect(symbol)}
            className={`rounded-full! min-w-[124px]! px-3.5! py-1.5! transition-all! ease-in-out! duration-150! active:scale-[0.97]! ${isSelected
                ? 'bg-accent-foreground! text-accent!'
                : 'hover:bg-muted-foreground/10! text-foreground!'
              }`}
          >
            <div className="flex items-center gap-2">
              <TokenIcon
                tokenSymbol={symbol}
                iconUrl={tokensMeta[symbol]?.iconUrl}
                size="sm"
              />
              <div className="flex flex-col items-start leading-tight">
                <span
                  className={`font-bold uppercase text-sm ${isSelected ? 'text-accent' : 'text-foreground'
                    }`}
                >
                  {symbol}
                </span>
                <span
                  className={`text-[10px] font-semibold ${isSelected ? 'text-accent/70' : 'text-muted-foreground'
                    }`}
                >
                  {balance}
                </span>
              </div>
            </div>
          </ButtonBase>
        )
      })}
    </div>
  )
}
