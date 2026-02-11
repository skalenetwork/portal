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
import { DEFAULT_ERC20_DECIMALS, DEFAULT_FRACTION_DIGITS, DEFAULT_FRACTION_DIGITS_USD } from './constants'

export function toWei(value: string, decimals: number): bigint {
  return parseUnits(value, decimals)
}

export function fromWei(value: BigNumberish, decimals: number): string {
  return formatUnits(value, decimals)
}

export function formatBalance(balance: bigint, decimals?: number): string {
  const tokenDecimals = decimals ?? DEFAULT_ERC20_DECIMALS
  return formatUnits(balance, tokenDecimals)
}

export function truncateDecimals(input: string, numDecimals: number): string {
  const delimiter = input.includes(',') ? ',' : '.'
  const [integerPart, decimalPart = ''] = input.split(delimiter)
  return `${integerPart}${delimiter}${decimalPart.slice(0, numDecimals)}`
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
  const totalDecimals = tokenDecimals + priceDecimals;
  const usdStr = truncateDecimals(
    formatUnits(amountWei * priceWei, totalDecimals),
    DEFAULT_FRACTION_DIGITS_USD
  );
  return Number(usdStr).toLocaleString(undefined, {
    maximumFractionDigits: DEFAULT_FRACTION_DIGITS_USD
  }) + ' USD';
}