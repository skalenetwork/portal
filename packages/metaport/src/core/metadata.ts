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
 * @file metadata.ts
 * @copyright SKALE Labs 2023-Present
 */

import { dc, type types, constants } from '@/core'

import mainnetMeta from '../meta/mainnet/chains.json'
import legacyMeta from '../meta/legacy/chains.json'
import regressionMeta from '../meta/regression/chains.json'
import testnetMeta from '../meta/testnet/chains.json'
import baseSepoliaTestnet from '../meta/base_sepolia_testnet/chains.json'


import * as MAINNET_CHAIN_ICONS from '../meta/mainnet/icons'
import * as LEGACY_CHAIN_ICONS from '../meta/legacy/icons'
import * as REGRESSION_CHAIN_ICONS from '../meta/regression/icons'
import * as TESTNET_CHAIN_ICONS from '../meta/testnet/icons'
import * as BASE_SEPOLIA_TESTNET_CHAIN_ICONS from '../meta/base_sepolia_testnet/icons'


const CHAIN_ICONS: { [network in types.SkaleNetwork]: any } = {
  mainnet: MAINNET_CHAIN_ICONS,
  legacy: LEGACY_CHAIN_ICONS,
  regression: REGRESSION_CHAIN_ICONS,
  testnet: TESTNET_CHAIN_ICONS,
  "base-sepolia-testnet": BASE_SEPOLIA_TESTNET_CHAIN_ICONS
}

export const CHAINS_META: types.NetworksMetadataMap = {
  mainnet: mainnetMeta,
  legacy: legacyMeta,
  regression: regressionMeta,
  testnet: testnetMeta,
  "base-sepolia-testnet": baseSepoliaTestnet

}

export function chainIconPath(skaleNetwork: types.SkaleNetwork, name: string, app?: string) {
  if (!name) return
  let filename = name.toLowerCase()
  if (app) filename += `-${app}`
  if (name === constants.MAINNET_CHAIN_NAME) {
    return CHAIN_ICONS[skaleNetwork]['mainnet']
  }
  filename = filename.replace(/^(_+)/, '$1').replace(/-([a-z0-9])/gi, (_, g) => g.toUpperCase())
  if (CHAIN_ICONS[skaleNetwork][filename]) {
    return CHAIN_ICONS[skaleNetwork][filename]
  }
}

export function getTokenName(token: dc.TokenData): string | undefined {
  if (!token) return
  return token.meta.name ?? token.meta.symbol
}
