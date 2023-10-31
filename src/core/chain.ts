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

export const HTTPS_PREFIX = 'https://'
export const WSS_PREFIX = 'wss://'

export function getRpcUrl(proxyUrl: string, schainName: string, prefix: string): string {
  return prefix + proxyUrl + '/v1/' + schainName
}

export function getRpcWsUrl(proxyUrl: string, schainName: string, prefix: string): string {
  return prefix + proxyUrl + '/v1/ws/' + schainName
}

export function getFsUrl(proxyUrl: string, schainName: string, prefix: string): string {
  return prefix + proxyUrl + '/fs/' + schainName
}

export function getExplorerUrl(explorerUrl: string, schainName: string): string {
  return HTTPS_PREFIX + schainName + '.' + explorerUrl
}

export function getChainId(schainName: string): string {
  return toBeHex(id(schainName).substring(0, 15))
}
