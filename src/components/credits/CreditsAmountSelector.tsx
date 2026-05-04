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
 * @file CreditsAmountSelector.tsx
 * @copyright SKALE Labs 2026-Present
 */

import { useState } from 'react'
import { Button, ButtonBase, TextField } from '@mui/material'
import { CircleCheck, CircleX, Pencil } from 'lucide-react'
import { TokenIcon } from '@skalenetwork/metaport'
import { units, notify } from '@/core'

interface CreditsAmountSelectorProps {
  recommended: readonly bigint[]
  amount: bigint
  setAmount: (value: bigint) => void
  pricePerCreditWei: bigint | undefined
  tokenSymbol?: string
  tokenDecimals: number
}

function formatTokenPrice(
  amount: bigint,
  pricePerCreditWei: bigint | undefined,
  tokenSymbol: string | undefined,
  tokenDecimals: number
): string {
  if (!tokenSymbol || pricePerCreditWei === undefined || pricePerCreditWei === 0n) return '—'
  const totalWei = pricePerCreditWei * amount
  return units.displayBalance(totalWei, tokenSymbol, tokenDecimals)
}

function formatCompactAmount(value: bigint): string {
  if (value < 1000n) return value.toString()
  if (value < 1_000_000n) {
    const whole = value / 1000n
    const tenths = (value % 1000n) / 100n
    return tenths === 0n ? `${whole}K` : `${whole}.${tenths}K`
  }
  if (value < 1_000_000_000n) {
    const whole = value / 1_000_000n
    const tenths = (value % 1_000_000n) / 100_000n
    return tenths === 0n ? `${whole}M` : `${whole}.${tenths}M`
  }
  const whole = value / 1_000_000_000n
  const tenths = (value % 1_000_000_000n) / 100_000_000n
  return tenths === 0n ? `${whole}B` : `${whole}.${tenths}B`
}

interface CardProps {
  selected: boolean
  onClick: () => void
  title: React.ReactNode
  subtitle: React.ReactNode
  tokenSymbol?: string
  popular?: boolean
}

function AmountCard({ selected, onClick, title, subtitle, tokenSymbol, popular }: CardProps) {
  return (
    <ButtonBase
      onClick={onClick}
      className={`creditsPlanCard relative! min-w-0! rounded-2xl! border-2! p-4! pt-5! flex-col! items-stretch! text-left! transition-all! ease-in-out! duration-150! active:scale-[0.97]! ${selected
        ? 'bg-accent-foreground! text-accent! border-accent-foreground!'
        : 'bg-background! text-foreground! border-transparent! hover:bg-muted-foreground/10!'
        }`}
    >
      {popular && (
        <span
          className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap shadow-sm ${selected
            ? 'bg-accent text-accent-foreground'
            : 'bg-accent-foreground text-accent'
            }`}
        >
          Most popular
        </span>
      )}
      <div className="w-full text-center min-w-0">
        <p
          className={`font-bold text-3xl leading-none truncate ${selected ? 'text-accent' : 'text-foreground'}`}
        >
          {title}
        </p>
      </div>
      <div className="w-full mt-3 flex items-center justify-center gap-1.5 min-w-0">
        {tokenSymbol && <TokenIcon tokenSymbol={tokenSymbol} size="xs" />}
        <p
          className={`text-xs font-semibold truncate ${selected ? 'text-accent/80' : 'text-muted-foreground'}`}
        >
          {subtitle}
        </p>
      </div>
    </ButtonBase>
  )
}

export default function CreditsAmountSelector({
  recommended,
  amount,
  setAmount,
  pricePerCreditWei,
  tokenSymbol,
  tokenDecimals
}: CreditsAmountSelectorProps) {
  const [editingCustom, setEditingCustom] = useState<boolean>(false)
  const [textValue, setTextValue] = useState<string>('')

  const isRecommended = recommended.includes(amount)
  const customAmount = !isRecommended ? amount : 0n

  function applyCustom() {
    const parsed = Number(textValue)
    if (
      textValue === '' ||
      !Number.isInteger(parsed) ||
      parsed <= 0 ||
      !/^\d+$/.test(textValue.trim())
    ) {
      notify.temporaryError('Enter a positive integer')
      return
    }
    setAmount(BigInt(parsed))
    setEditingCustom(false)
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      {recommended.map((value) => {
        const selected = amount === value && isRecommended
        return (
          <AmountCard
            key={value.toString()}
            selected={selected}
            popular={value === 40n}
            onClick={() => {
              setAmount(value)
              setEditingCustom(false)
            }}
            title={value.toString()}
            subtitle={formatTokenPrice(value, pricePerCreditWei, tokenSymbol, tokenDecimals)}
            tokenSymbol={tokenSymbol}
          />
        )
      })}
      {editingCustom ? (
        <div className="creditsPlanCard min-w-0 rounded-2xl border-2 border-transparent bg-background p-2 flex flex-col items-stretch gap-2">
          <div className="monthInputWrap bg-muted-foreground/10 flex items-center justify-center w-full overflow-hidden px-1.5! py-1!">
            <TextField
              autoFocus
              variant="standard"
              type="number"
              value={textValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const v = e.target.value
                if (v === '' || /^\d+$/.test(v)) setTextValue(v)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') applyCustom()
              }}
              placeholder="0"
              slotProps={{
                htmlInput: {
                  className:
                    'text-foreground! text-center! font-bold! text-xl! w-full! min-w-0! p-0!',
                  min: 1
                }
              }}
              className="monthInput w-full!"
            />
          </div>
          <div className="flex gap-1">
            <Button
              size="small"
              startIcon={<CircleCheck size={14} />}
              className="grow rounded-full! bg-accent-foreground! text-accent! normal-case! text-xs! py-2!"
              onClick={applyCustom}
            >
              Apply
            </Button>
            <Button
              size="small"
              className="rounded-full! bg-muted-foreground/10! text-muted-foreground! normal-case! min-w-0! px-2! py-2!"
              onClick={() => setEditingCustom(false)}
            >
              <CircleX size={14} />
            </Button>
          </div>
        </div>
      ) : (
        <AmountCard
          selected={!isRecommended && amount > 0n}
          onClick={() => {
            setTextValue(customAmount > 0n ? customAmount.toString() : '')
            setEditingCustom(true)
          }}
          title={
            <span className="inline-flex items-center gap-1.5 max-w-full">
              <span className="truncate">
                {customAmount > 0n ? formatCompactAmount(customAmount) : 'Custom'}
              </span>
              {customAmount > 0n && <Pencil size={14} className="shrink-0" />}
            </span>
          }
          subtitle={
            customAmount > 0n
              ? formatTokenPrice(customAmount, pricePerCreditWei, tokenSymbol, tokenDecimals)
              : 'Any amount'
          }
          tokenSymbol={customAmount > 0n ? tokenSymbol : undefined}
        />
      )}
    </div>
  )
}
