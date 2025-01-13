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

import { TokenData } from './dataclasses'
import { SkaleNetwork, NetworksMetadataMap } from './interfaces'
import { MAINNET_CHAIN_NAME } from './constants'

import mainnetMeta from '../meta/mainnet/chains.json'
import legacyMeta from '../meta/legacy/chains.json'
import regressionMeta from '../meta/regression/chains.json'
import testnetMeta from '../meta/testnet/chains.json'

import * as MAINNET_CHAIN_ICONS from '../meta/mainnet/icons'
import * as LEGACY_CHAIN_ICONS from '../meta/legacy/icons'
import * as REGRESSION_CHAIN_ICONS from '../meta/regression/icons'
import * as TESTNET_CHAIN_ICONS from '../meta/testnet/icons'

const CHAIN_ICONS: { [network in SkaleNetwork]: any } = {
  mainnet: MAINNET_CHAIN_ICONS,
  legacy: LEGACY_CHAIN_ICONS,
  regression: REGRESSION_CHAIN_ICONS,
  testnet: TESTNET_CHAIN_ICONS
}

export const CHAINS_META: NetworksMetadataMap = {
  mainnet: mainnetMeta,
  legacy: legacyMeta,
  regression: regressionMeta,
  testnet: testnetMeta
}

// deprecated, remove after merge
function transformChainName(chainName: string): string {
  return chainName
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

// deprecated, remove after merge
export function getChainAlias(
  skaleNetwork: SkaleNetwork,
  chainName: string,
  app?: string,
  prettify?: boolean
): string {
  if (chainName === MAINNET_CHAIN_NAME) {
    if (skaleNetwork != MAINNET_CHAIN_NAME) {
      return `Ethereum (${skaleNetwork})`
    }
    return 'Ethereum'
  }
  if (CHAINS_META[skaleNetwork] && CHAINS_META[skaleNetwork][chainName]) {
    if (
      app &&
      CHAINS_META[skaleNetwork][chainName].apps &&
      CHAINS_META[skaleNetwork][chainName].apps[app]
    ) {
      return CHAINS_META[skaleNetwork][chainName].apps[app].alias
    }
    return CHAINS_META[skaleNetwork][chainName].alias
  }
  if (prettify) return transformChainName(chainName)
  return chainName
}

export function getChainAppsMeta(chainName: string, skaleNetwork: SkaleNetwork) {
  if (CHAINS_META[skaleNetwork][chainName] && CHAINS_META[skaleNetwork][chainName].apps) {
    return CHAINS_META[skaleNetwork][chainName].apps
  }
}

export function chainIconPath(skaleNetwork: SkaleNetwork, name: string, app?: string) {
  if (!name) return
  let filename = name.toLowerCase()
  if (app) filename += `-${app}`
  if (name === MAINNET_CHAIN_NAME) {
    return CHAIN_ICONS[skaleNetwork]['mainnet']
  }
  filename = filename.replace(/^(_+)/, '$1').replace(/-([a-z0-9])/gi, (_, g) => g.toUpperCase())
  if (CHAIN_ICONS[skaleNetwork][filename]) {
    return CHAIN_ICONS[skaleNetwork][filename]
  }
}

// deprecated, remove after merge
export function chainBg(skaleNetwork: SkaleNetwork, chainName: string, app?: string): string {
  if (CHAINS_META[skaleNetwork][chainName]) {
    if (app && CHAINS_META[skaleNetwork][chainName]['apps'][app]) {
      if (CHAINS_META[skaleNetwork][chainName]['apps'][app]['gradientBackgroundLight']) {
        return CHAINS_META[skaleNetwork][chainName]['apps'][app]['gradientBackgroundLight']
      }
      if (CHAINS_META[skaleNetwork][chainName]['apps'][app]['gradientBackground']) {
        return CHAINS_META[skaleNetwork][chainName]['apps'][app]['gradientBackground']
      }
      return CHAINS_META[skaleNetwork][chainName]['apps'][app]['background']
    }
    if (CHAINS_META[skaleNetwork][chainName]['gradientBackgroundLight']) {
      return CHAINS_META[skaleNetwork][chainName]['gradientBackgroundLight']
    }
    if (CHAINS_META[skaleNetwork][chainName]['gradientBackground']) {
      return CHAINS_META[skaleNetwork][chainName]['gradientBackground']
    }
    return CHAINS_META[skaleNetwork][chainName]['background']
  }
  return 'linear-gradient(273.67deg, rgb(47 50 80), rgb(39 43 68))'
}

export function tokenIcon(tokenSymbol: string) {
  if (!tokenSymbol) return
  const key = tokenSymbol.toLowerCase()
  return key
  // if (icons[key]) {
  //   return icons[key]
  // } else {
  //   return icons['eth']
  // }
}

export function getTokenName(token: TokenData): string | undefined {
  if (!token) return
  return token.meta.name ?? token.meta.symbol
}
