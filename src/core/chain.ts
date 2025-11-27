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
 * @file chain.ts
 * @copyright SKALE Labs 2023-Present
 */

import { id, toBeHex, toQuantity } from 'ethers'
import { type types } from '@/core'

export function formatSChains(schainsData: types.ISChainData[]): types.ISChain[] {
  return schainsData.map((schainData) => formatSChain(schainData.schain))
}

function formatSChain(schain: types.ISChainProxy | types.TSChainArray): types.ISChain {
  const isArray = Array.isArray(schain)
  if (isArray) {
    const schainArray = schain as types.TSChainArray
    return {
      name: schainArray[0],
      mainnetOwner: schainArray[1],
      indexInOwnerList: schainArray[2],
      partOfNode: schainArray[3],
      lifetime: schainArray[4],
      startDate: schainArray[5],
      startBlock: schainArray[6],
      deposit: schainArray[7],
      index: schainArray[8],
      generation: schainArray[9],
      originator: schainArray[10],
      multitransactionMode: schainArray[11],
      thresholdEncryption: schainArray[12],
      allocationType: 0
    }
  }
  const schainProxy = schain as types.ISChainProxy
  return {
    name: schainProxy['name'],
    mainnetOwner: schainProxy['mainnet_owner'],
    indexInOwnerList: schainProxy['index_in_owner_list'],
    partOfNode: schainProxy['part_of_node'],
    lifetime: schainProxy['lifetime'],
    startDate: schainProxy['start_date'],
    startBlock: schainProxy['start_block'],
    deposit: schainProxy['deposit'],
    index: schainProxy['index'],
    generation: schainProxy['generation'],
    originator: schainProxy['originator'],
    multitransactionMode: schainProxy['options']['multitransaction_mode'],
    thresholdEncryption: schainProxy['options']['threshold_encryption'],
    allocationType: schainProxy['options']['allocation_type']
  }
}

export function getRpcUrl(proxyUrl: string, schainName: string, prefix: string): string {
  return prefix + proxyUrl + '/v1/' + schainName
}

export function getRpcWsUrl(proxyUrl: string, schainName: string, prefix: string): string {
  return prefix + proxyUrl + '/v1/ws/' + schainName
}

export function getFsUrl(proxyUrl: string, schainName: string, prefix: string): string {
  return prefix + proxyUrl + '/fs/' + schainName
}

export function getChainId(schainName: string): string {
  return toQuantity(toBeHex(id(schainName).substring(0, 15)))
}

export function getChainIdInt(schainName: string): number {
  return parseInt(getChainId(schainName), 16)
}

export function getAllocationTypeName(allocationType: number): string {
  switch (allocationType) {
    case 0:
      return 'Default'
    case 1:
      return 'No Filestorage'
    case 2:
      return 'Max Contract Storage'
    case 3:
      return 'Max Consensus DB'
    case 4:
      return 'Max Filestorage'
    default:
      return 'Unknown'
  }
}

export function hasFilestorage(allocationType: number): boolean {
  return allocationType === 0 || allocationType === 4
}
