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
 * @file chain_id.ts
 * @copyright SKALE Labs 2023-Present
 */

import { ethers } from 'ethers'

export function remove0x(s: any) {
  if (!s.startsWith('0x')) return s
  return s.slice(2)
}

function calcChainId(chainName: string): number {
  let h = ethers.solidityPackedKeccak256(['string'], [chainName])
  h = remove0x(h).toLowerCase()
  while (h.length < 64) h = '0' + h
  h = h.substr(0, 13)
  h = h.replace(/^0+/, '')
  return ethers.getNumber('0x' + h)
}

export function getChainId(chainName: string): number {
  return calcChainId(chainName)
}
