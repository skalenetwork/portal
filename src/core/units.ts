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
 * @file units.ts
 * @copyright SKALE Labs 2022-Present
 */

import { formatUnits, parseUnits } from 'viem'
import {
  DEFAULT_ERC20_DECIMALS,
  DEFAULT_FRACTION_DIGITS,
  DEFAULT_FRACTION_DIGITS_USD
} from './constants'

const AMOUNT = /^\d*(\.\d*)?$/
const DECIMAL_SEPARATOR =
  new Intl.NumberFormat().formatToParts(1.1).find((part) => part.type === 'decimal')?.value ?? '.'

/** The fraction gate is what keeps parseUnits from rounding: viem rounds half-up
 * once the input is more precise than the token, which would silently move funds. */
export function parseAmount(value: string, decimals: number): bigint | null {
  if (value === '' || value === '.' || !AMOUNT.test(value)) return null
  if ((value.split('.')[1] ?? '').replace(/0+$/, '').length > decimals) return null
  return parseUnits(value, decimals)
}

export function toWei(value: string, decimals: number): bigint {
  const wei = parseAmount(value, decimals)
  if (wei === null) throw new Error(`Invalid amount: ${value}`)
  return wei
}

export function fromWei(value: bigint, decimals: number): string {
  return formatUnits(value, decimals)
}

export function formatBalance(balance: bigint, decimals?: number): string {
  return formatUnits(balance, decimals ?? DEFAULT_ERC20_DECIMALS)
}

export function truncateDecimals(input: string | null | undefined, numDecimals: number): string {
  if (!input) return ''
  const delimiter = input.includes(',') ? ',' : '.'
  const [integerPart, decimalPart] = input.split(delimiter)
  if (decimalPart === undefined) return integerPart
  const truncated = decimalPart.slice(0, numDecimals)
  return truncated ? `${integerPart}${delimiter}${truncated}` : integerPart
}

export function formatAmount(value: string): string {
  const [integerPart, decimalPart] = value.split('.')
  if (!/^\d*$/.test(integerPart)) return value
  const grouped = BigInt(integerPart || '0').toLocaleString()
  return decimalPart ? `${grouped}${DECIMAL_SEPARATOR}${decimalPart}` : grouped
}

export function displayBalance(
  value: bigint,
  tokenSymbol?: string,
  customDecimals?: number
): string {
  const res = Number(
    truncateDecimals(
      fromWei(value, customDecimals ?? DEFAULT_ERC20_DECIMALS),
      DEFAULT_FRACTION_DIGITS
    )
  ).toLocaleString(undefined, {
    maximumFractionDigits: DEFAULT_FRACTION_DIGITS
  })
  return res + (tokenSymbol ? ` ${tokenSymbol.toUpperCase()}` : '')
}

export function displaySklValueUsd(
  amountWei: bigint,
  priceWei: bigint,
  tokenDecimals: number = DEFAULT_ERC20_DECIMALS,
  priceDecimals: number = DEFAULT_ERC20_DECIMALS
): string {
  const totalDecimals = tokenDecimals + priceDecimals
  const usdStr = truncateDecimals(
    formatUnits(amountWei * priceWei, totalDecimals),
    DEFAULT_FRACTION_DIGITS_USD
  )
  return (
    Number(usdStr).toLocaleString(undefined, {
      maximumFractionDigits: DEFAULT_FRACTION_DIGITS_USD
    }) + ' USD'
  )
}
