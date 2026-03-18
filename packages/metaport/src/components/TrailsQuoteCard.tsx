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
 * @file TrailsQuoteCard.tsx
 * @copyright SKALE Labs 2026-Present
 */

import { useState } from 'react'
import Collapse from '@mui/material/Collapse'
import { AlertTriangle, ArrowDownRight, ArrowUpRight, ChevronDown, Clock, Coins, Route } from 'lucide-react'

import SkPaper from './SkPaper'
import TokenIcon from './TokenIcon'
import trailsLogo from '../assets/trails_logo.svg'
import { useMetaportStore } from '../store/MetaportStore'
import { type QuoteIntentResponse } from '../core/trails'

function formatAmount(amount: bigint, decimals: number): string {
  const divisor = 10n ** BigInt(decimals)
  const whole = amount / divisor
  const fraction = amount % divisor
  const fractionStr = fraction.toString().padStart(decimals, '0').replace(/0+$/, '')
  return fractionStr ? `${whole}.${fractionStr}` : whole.toString()
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `~${seconds}s`
  const minutes = Math.round(seconds / 60)
  return `~${minutes}m`
}

function formatUsd(value: number): string {
  return `$${value.toFixed(2)}`
}

export default function TrailsQuoteCard(props: {
  quote: QuoteIntentResponse | null
  error: string | null
  tokenSymbol?: string | null
}) {
  const [detailsOpen, setDetailsOpen] = useState(false)
  const tokenSymbol = props.tokenSymbol ?? 'TOKEN'
  const amount = useMetaportStore((state) => state.amount)
  const sendAmount = amount && amount.trim() !== '' ? amount : '—'

  if (props.error) {
    return (
      <SkPaper gray className="mt-3 p-5.5!">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            <Route size={13} className="text-secondary-foreground" />
            <span className="text-xs text-secondary-foreground font-medium">Routed via</span>
            <a href="https://trails.build/" target="_blank" rel="noreferrer noopener" className="flex items-center">
              <img src={trailsLogo} alt="Trails" className="h-5 rounded-sm" />
            </a>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-amber-600 dark:text-amber-400">
            <AlertTriangle size={12} />
            <span className="text-xs font-medium ">Unable to get a quote from Trails</span>
          </div>
        </div>

        <div className="flex items-baseline justify-between pt-2">
          <div>
            <p className="text-xs text-secondary-foreground capitalize text-left font-medium m-0 flex items-center gap-1">
              <ArrowUpRight size={12} />
              You send
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <TokenIcon tokenSymbol={tokenSymbol} size="xs" />
              <p className="text-xl font-bold text-foreground m-0">{sendAmount} {tokenSymbol}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-secondary-foreground capitalize text-right font-medium m-0 flex items-center justify-end gap-1">
              <ArrowDownRight size={12} />
              You receive (min)
            </p>
            <div className="flex items-center justify-end gap-1.5 mt-0.5">
              <TokenIcon tokenSymbol={tokenSymbol} size="xs" />
              <p className="text-xl font-bold text-foreground m-0">N/A</p>
            </div>
          </div>
        </div>
      </SkPaper>
    )
  }

  if (!props.quote) return null

  const { intent } = props.quote
  const { quote, fees } = intent
  const depositTx = intent.depositTransaction

  const originDecimals = depositTx.decimals ?? 6
  const destDecimals = depositTx.decimals ?? 6

  const outputAmount = formatAmount(quote.toAmountMin, destDecimals)
  const inputAmount = formatAmount(quote.fromAmount, originDecimals)

  const estimatedTime = quote.estimatedDuration
    ? formatDuration(quote.estimatedDuration)
    : null

  const totalFeeUsd = formatUsd(fees.totalFeeUsd)
  const gasFeeUsd = formatUsd(fees.gasFeeUsd)
  const providerFeeUsd = formatUsd(fees.providerFeeUsd)
  const trailsFeeUsd = formatUsd(fees.trailsFeeUsd)

  const slippage = (quote.maxSlippage * 100).toFixed(2)
  const route = quote.routeProviders.join(' → ')

  return (
    <SkPaper gray className="mt-3 p-5.5!">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1">
          <Route size={13} className="text-secondary-foreground" />
          <span className="text-xs text-secondary-foreground font-medium">Routed via</span>
          <a href="https://trails.build/" target="_blank" rel="noreferrer noopener" className="flex items-center">
            <img src={trailsLogo} alt="Trails" className="h-5 rounded-sm" />
          </a>
        </div>
        {estimatedTime && (
          <span className="flex items-center gap-1 text-xs text-secondary-foreground bg-background rounded-full px-2 py-0.5 font-medium">
            <Clock size={12} />
            {estimatedTime}
          </span>
        )}
      </div>

      <div className="flex items-baseline justify-between mb-2.5 pt-2">
        <div>
          <p className="text-xs text-secondary-foreground capitalize text-left font-medium m-0 flex items-center gap-1">
            <ArrowUpRight size={12} />
            You send
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <TokenIcon tokenSymbol={tokenSymbol} size="xs" />
            <p className="text-xl font-bold text-foreground m-0">{inputAmount} {tokenSymbol}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-secondary-foreground capitalize text-right font-medium m-0 flex items-center justify-end gap-1">
            <ArrowDownRight size={12} />
            You receive (min)
          </p>
          <div className="flex items-center justify-end gap-1.5 mt-0.5">
            <TokenIcon tokenSymbol={tokenSymbol} size="xs" />
            <p className="text-xl font-bold text-foreground m-0">{outputAmount} {tokenSymbol}</p>
          </div>
        </div>
      </div>

      <div
        className="flex items-center cursor-pointer select-none pt-2"
        onClick={() => setDetailsOpen(!detailsOpen)}
      >
        <div className="flex items-center gap-1.5">
          <Coins size={15} className="text-secondary-foreground" />
          <span className="text-xs text-secondary-foreground font-medium">Fee</span>
        </div>
        <div className="flex grow" />
        <span className="text-xs text-foreground font-medium mr-2">{totalFeeUsd}</span>
        <ChevronDown
          size={17}
          className={`text-secondary-foreground transition-transform ${detailsOpen ? 'rotate-180' : ''}`}
        />
      </div>

      <Collapse in={detailsOpen}>
        <div className="pt-4 space-y-1.5">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-muted-foreground">Gas fee</span>
            <span className="text-foreground">{gasFeeUsd}</span>
          </div>
          <div className="flex justify-between text-xs font-medium">
            <span className="text-muted-foreground">Provider fee</span>
            <span className="text-foreground">{providerFeeUsd}</span>
          </div>
          <div className="flex justify-between text-xs font-medium">
            <span className="text-muted-foreground">Trails fee</span>
            <span className="text-foreground">{trailsFeeUsd}</span>
          </div>
          <div className="flex justify-between text-xs font-medium">
            <span className="text-muted-foreground">Slippage tolerance</span>
            <span className="text-foreground">{slippage}%</span>
          </div>
          <div className="flex justify-between text-xs font-medium">
            <span className="text-muted-foreground">Route</span>
            <span className="text-foreground">{route}</span>
          </div>
        </div>
      </Collapse>
    </SkPaper>
  )
}
