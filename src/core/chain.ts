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

import { id, toBeHex } from 'ethers'
import { ISChain, ISChainData, TSChainArray } from './types'
import { interfaces } from '@skalenetwork/metaport'

export const HTTPS_PREFIX = 'https://'
export const WSS_PREFIX = 'wss://'

export function formatSChains(schainsData: ISChainData[]): ISChain[] {
  return schainsData.map((schainData) => formatSChain(schainData.schain))
}

function formatSChain(schainArray: TSChainArray): ISChain {
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
    thresholdEncryption: schainArray[12]
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
  return toBeHex(id(schainName).substring(0, 15))
}

export function getChainShortAlias(meta: interfaces.ChainsMetadataMap, name: string): string {
  return meta[name]?.shortAlias !== undefined ? meta[name].shortAlias! : name
}

export function getChainDescription(meta: interfaces.ChainMetadata | undefined): string {
  return meta && meta.description ? meta.description : 'No description'
}

export function findChainName(meta: interfaces.ChainsMetadataMap, name: string): string {
  for (const key in meta) {
    if (meta[key].shortAlias === name) {
      return key
    }
  }
  return name
}
