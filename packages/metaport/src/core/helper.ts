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

import { getAddress } from 'ethers'

import { COMMUNITY_POOL_DECIMALS, MAINNET_CHAIN_NAME } from './constants'

export function eqArrays(arr1, arr2) {
  return JSON.stringify(arr1) === JSON.stringify(arr2)
}

export function isMainnet(chainName: string): boolean {
  return chainName === MAINNET_CHAIN_NAME
}

export function addressesEqual(address1: string, address2: string): boolean {
  return getAddress(address1) === getAddress(address2)
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
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

export function roundDown(num: number, decimals: number = COMMUNITY_POOL_DECIMALS): number {
  decimals = decimals || 0
  return Math.floor(num * Math.pow(10, decimals)) / Math.pow(10, decimals)
}

export function roundUp(num: number, decimals: number = COMMUNITY_POOL_DECIMALS): number {
  const factor = Math.pow(10, decimals)
  return Math.round(num * factor) / factor
}
