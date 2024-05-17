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
 * @file helper.ts
 * @copyright SKALE Labs 2024-Present
 */

import { fromWei, type interfaces } from '@skalenetwork/metaport'
import { DEFAULT_ERC20_DECIMALS, ZERO_ADDRESS } from './constants'

export function isZeroAddr(address: interfaces.AddressType): boolean {
  return address === ZERO_ADDRESS
}

export function truncateDecimals(input: string, numDecimals: number): string {
  const delimiter = input.includes(',') ? ',' : '.'
  const [integerPart, decimalPart = ''] = input.split(delimiter)
  return `${integerPart}${delimiter}${decimalPart.slice(0, numDecimals)}`
}

export function formatBalance(
  value: bigint,
  tokenSymbol?: string,
  customDecimals?: string
): string {
  const res = Number(
    truncateDecimals(fromWei(value, customDecimals ?? DEFAULT_ERC20_DECIMALS), 5)
  ).toLocaleString()
  return res + (tokenSymbol ? ` ${tokenSymbol}` : '')
}

export function compareEnum(enumValue1: any, enumValue2: any): boolean {
  return Number(enumValue1) === Number(enumValue2)
}

export function convertMonthIndexToText(index: number): string {
  const baseYear = 2020
  const monthsPerYear = 12

  const year = baseYear + Math.floor(index / monthsPerYear)
  const month = index % monthsPerYear

  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ]
  return `${monthNames[month]} ${year}`
}

export function maxBigInt(a: bigint, b: bigint): bigint {
  return a > b ? a : b
}

export function minBigInt(a: bigint, b: bigint): bigint {
  return a < b ? a : b
}

export function shortAddress(address: interfaces.AddressType | undefined): string {
  if (!address) return ''
  return `${address.slice(0, 4)}...${address.slice(-2)}`
}

export function timestampToDate(ts: number) {
  return new Intl.DateTimeFormat('en-US', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit'
  }).format(ts * 1000)
}
