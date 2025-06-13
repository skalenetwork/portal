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
 * @copyright SKALE Labs 2025-Present
 */

import { type types, metadata } from '@/core'


export function extractFirstSentence(description: string): string {
  return description.split('.')[0] + (description.includes('.') ? '.' : '')
}

export function getChainDescription(chainsMeta: types.ChainsMetadataMap, chainName: string): string {
  const chainMeta = chainsMeta[chainName]
  return chainMeta
    ? chainMeta.description
    : 'Ethereum is a global, decentralized platform for money and new kinds of applications.'
}

export function getChainCardBackgroundColor(
  disabled: boolean, 
  chainsMeta: types.ChainsMetadataMap, 
  chainName: string
): string {
  return disabled ? '#a1a1a133' : metadata.chainBg(chainsMeta, chainName)
}
