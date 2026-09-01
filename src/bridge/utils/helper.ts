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

import { type types, metadata, constants, networks } from '@/core'

export function extractFirstSentence(description: string): string {
  return description.split('.')[0] + (description.includes('.') ? '.' : '')
}

export function getChainDescription(
  network: types.SkaleNetwork,
  chainsMeta: types.ChainsMetadataMap,
  chainName: string
): string {
  if (chainName === constants.MAINNET_CHAIN_NAME) {
    return networks.MAINNET_DESCRIPTIONS[network]
  }
  const chainMeta = chainsMeta[chainName]
  return chainMeta
    ? chainMeta.description
    : 'Ethereum is a global, decentralized platform for money and new kinds of applications.'
}

export function getChainCardBackgroundColor(
  network: types.SkaleNetwork,
  disabled: boolean,
  chainsMeta: types.ChainsMetadataMap,
  chainName: string,
  theme?: 'light' | 'dark'
): string {
  return disabled ? '#a1a1a133' : metadata.chainBg(network, chainsMeta, chainName, undefined, theme)
}

function parseRgb(css: string): [number, number, number] | null {
  const hexMatch = css.match(/#([0-9a-f]{3,8})\b/i)
  if (hexMatch) {
    let hex = hexMatch[1]
    if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
    return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)]
  }
  const rgbMatch = css.match(/rgb\(?\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/)
  if (rgbMatch) return [+rgbMatch[1], +rgbMatch[2], +rgbMatch[3]]
  return null
}

export function getContrastTextColor(background: string): string {
  const rgb = parseRgb(background)
  if (!rgb) return 'rgba(255,255,255,0.7)'
  const luminance = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255
  return luminance > 0.5 ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.9)'
}
