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
 * @file MesonQuoteCard.tsx
 * @copyright SKALE Labs 2026-Present
 */

import { useState } from 'react'
import Collapse from '@mui/material/Collapse'
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  ChevronDown,
  Clock,
  Coins,
  Route
} from 'lucide-react'

import SkPaper from './SkPaper'
import TokenIcon from './TokenIcon'
import mesonLogo from '../assets/meson_logo.png'
import { type MesonQuote } from '../core/meson'

export default function MesonQuoteCard(props: {
  quote: MesonQuote | null
  error: string | null
  tokenSymbol?: string | null
  amount?: string
}) {
  const [detailsOpen, setDetailsOpen] = useState(false)
  const tokenSymbol = props.tokenSymbol ?? 'TOKEN'
  const sendAmount = props.amount && props.amount.trim() !== '' ? props.amount : '—'

  if (props.error) {
    return (
      <SkPaper gray className="mt-3 p-5.5!">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            <Route size={13} className="text-secondary-foreground" />
            <span className="text-xs text-secondary-foreground font-medium">Routed via</span>
            <a
              href="https://meson.fi/"
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-center"
            >
              <img src={mesonLogo} alt="Meson" className="h-5 rounded-sm" />
            </a>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-amber-600 dark:text-amber-400">
            <AlertTriangle size={12} />
            <span className="text-xs font-medium">Unable to get a quote from Meson</span>
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
              <p className="text-xl font-bold text-foreground m-0">
                {sendAmount} {tokenSymbol}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-secondary-foreground capitalize text-right font-medium m-0 flex items-center justify-end gap-1">
              <ArrowDownRight size={12} />
              You receive
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

  const { fee, amount } = props.quote
  const totalFee = fee.totalFee
  const serviceFee = fee.serviceFee
  const lpFee = fee.lpFee

  const receiveAmount =
    Number(amount) > 0 && Number(totalFee) >= 0
      ? (Number(amount) - Number(totalFee)).toFixed(6).replace(/\.?0+$/, '')
      : '—'

  return (
    <SkPaper gray className="mt-3 p-5.5!">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1">
          <Route size={13} className="text-secondary-foreground" />
          <span className="text-xs text-secondary-foreground font-medium">Routed via</span>
          <a
            href="https://meson.fi/"
            target="_blank"
            rel="noreferrer noopener"
            className="flex items-center"
          >
            <img src={mesonLogo} alt="Meson" className="h-5 rounded-sm" />
          </a>
        </div>
        <span className="flex items-center gap-1 text-xs text-secondary-foreground bg-background rounded-full px-2 py-0.5 font-medium">
          <Clock size={12} />
          ~1-2m
        </span>
      </div>

      <div className="flex items-baseline justify-between mb-2.5 pt-2">
        <div>
          <p className="text-xs text-secondary-foreground capitalize text-left font-medium m-0 flex items-center gap-1">
            <ArrowUpRight size={12} />
            You send
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <TokenIcon tokenSymbol={tokenSymbol} size="xs" />
            <p className="text-xl font-bold text-foreground m-0">
              {amount} {tokenSymbol}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-secondary-foreground capitalize text-right font-medium m-0 flex items-center justify-end gap-1">
            <ArrowDownRight size={12} />
            You receive
          </p>
          <div className="flex items-center justify-end gap-1.5 mt-0.5">
            <TokenIcon tokenSymbol={tokenSymbol} size="xs" />
            <p className="text-xl font-bold text-foreground m-0">
              {receiveAmount} {tokenSymbol}
            </p>
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
        <span className="text-xs text-foreground font-medium mr-2">{totalFee} {tokenSymbol}</span>
        <ChevronDown
          size={17}
          className={`text-secondary-foreground transition-transform ${detailsOpen ? 'rotate-180' : ''}`}
        />
      </div>

      <Collapse in={detailsOpen}>
        <div className="pt-4 space-y-1.5">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-muted-foreground">Service fee</span>
            <span className="text-foreground">{serviceFee} {tokenSymbol}</span>
          </div>
          <div className="flex justify-between text-xs font-medium">
            <span className="text-muted-foreground">Liquidity fee</span>
            <span className="text-foreground">{lpFee} {tokenSymbol}</span>
          </div>
        </div>
      </Collapse>
    </SkPaper>
  )
}
