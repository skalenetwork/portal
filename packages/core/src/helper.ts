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
 * @file helper.ts
 * @copyright SKALE Labs 2022-Present
 */

import { formatUnits, getAddress, keccak256, toUtf8Bytes } from 'ethers'
import { types } from '.'
import * as constants from './constants'

export function isZeroAddr(address: types.AddressType): boolean {
  return address === constants.ZERO_ADDRESS
}

export function eqArrays(arr1: any[], arr2: any[]): boolean {
  return JSON.stringify(arr1) === JSON.stringify(arr2)
}

export function isMainnet(chainName: string): boolean {
  return chainName === constants.MAINNET_CHAIN_NAME
}

export function addressesEqual(address1: string, address2: string): boolean {
  return getAddress(address1) === getAddress(address2)
}

export function maxBigInt(a: bigint, b: bigint): bigint {
  return a > b ? a : b
}

export function minBigInt(a: bigint, b: bigint): bigint {
  return a < b ? a : b
}

export function shortAddress(address: types.AddressType | undefined): string {
  if (!address) return ''
  return `${address.slice(0, 4)}...${address.slice(-2)}`
}

export function shortBalance(balance: bigint | undefined, decimals?: number): string {
  if (balance === undefined) return ''
  if (balance === 0n) return '0'
  const formatted = formatUnits(balance, decimals ?? 18)
  if (formatted.length <= 8) return formatted
  return `${formatted.slice(0, 5)}...${formatted.slice(-3)}`
}

export function getRandom(list: Array<any>) {
  return list[Math.floor(Math.random() * list.length)]
}

export async function sleep(ms: number): Promise<any> {
  return await new Promise((resolve) => setTimeout(resolve, ms))
}

export function sortObjectByKeys(obj: { [key: string]: any }): { [key: string]: any } {
  const sortedKeys = Object.keys(obj).sort()
  const sortedObject: { [key: string]: any } = {}

  for (const key of sortedKeys) {
    sortedObject[key] = obj[key]
  }

  return sortedObject
}

export function roundDown(num: number, decimals: number = constants.ROUNDING_DECIMALS): number {
  decimals = decimals || 0
  return Math.floor(num * Math.pow(10, decimals)) / Math.pow(10, decimals)
}

export function roundUp(num: number, decimals: number = constants.ROUNDING_DECIMALS): number {
  const factor = Math.pow(10, decimals)
  return Math.round(num * factor) / factor
}

export function divideBigInts(a: bigint, b: bigint): number {
  return Number((a * 10000n) / b) / 10000
}

type BlockProvider<TBlock extends { timestamp: number }> = {
  getBlock: (blockNumber: number) => Promise<TBlock | null>
}

export async function getBlockWithRetry<TBlock extends { timestamp: number }>(
  provider: BlockProvider<TBlock>,
  blockNumber: number,
  sleepInterval = 500,
  iterations = 10
): Promise<TBlock> {
  for (let i = 0; i < iterations; i++) {
    const block = await provider.getBlock(blockNumber)
    if (block) return block
    await sleep(sleepInterval)
  }
  throw new Error(`Failed to load block: ${blockNumber}`)
}

export function schainNameToHash(schainName: string): string {
  return keccak256(toUtf8Bytes(schainName))
}
