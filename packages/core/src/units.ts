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

import { formatUnits, parseUnits, BigNumberish } from 'ethers'
import { DEFAULT_ERC20_DECIMALS } from './constants'


export function toWei(value: string, decimals: string): bigint {
  return parseUnits(value, parseInt(decimals as string))
}

export function fromWei(value: BigNumberish, decimals: string): string {
  return formatUnits(value, parseInt(decimals as string))
}

export function formatBalance(balance: bigint, decimals?: string): string {
  const tokenDecimals = decimals ?? DEFAULT_ERC20_DECIMALS
  return formatUnits(balance, parseInt(tokenDecimals))
}

export function truncateDecimals(input: string, numDecimals: number): string {
  const delimiter = input.includes(',') ? ',' : '.'
  const [integerPart, decimalPart = ''] = input.split(delimiter)
  return `${integerPart}${delimiter}${decimalPart.slice(0, numDecimals)}`
}
