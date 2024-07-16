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
 * @file metadata.ts
 * @copyright SKALE Labs 2024-Present
 */

import { type interfaces } from '@skalenetwork/metaport'
import { BASE_METADATA_URL, MAINNET_CHAIN_NAME } from './constants'

export function chainBg(
  chainsMeta: interfaces.ChainsMetadataMap,
  chainName: string,
  app?: string
): string {
  const chainData = chainsMeta[chainName]

  if (chainData) {
    const appData = chainData.apps && app ? chainData.apps[app] : null

    return (
      appData?.gradientBackground ||
      appData?.background ||
      chainData.gradientBackground ||
      chainData.background
    )
  }

  return 'linear-gradient(273.67deg, rgb(47 50 80), rgb(39 43 68))'
}

export function getChainAlias(
  chainsMeta: interfaces.ChainsMetadataMap,
  chainName: string,
  app?: string
): string {
  if (chainName === MAINNET_CHAIN_NAME) {
    return 'Ethereum'
  }

  const chainData = chainsMeta?.[chainName]
  const appData = app ? chainData?.apps?.[app] : null

  return appData?.alias || chainData?.alias || transformChainName(chainName)
}

function transformChainName(chainName: string): string {
  return chainName
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

export async function loadMeta(
  skaleNetwork: interfaces.SkaleNetwork
): Promise<interfaces.ChainsMetadataMap> {
  const response = await fetch(`${BASE_METADATA_URL}${skaleNetwork}/chains.json`)
  return await response.json()
}

export function getMetaLogoUrl(skaleNetwork: interfaces.SkaleNetwork, logoName: string): string {
  return `${BASE_METADATA_URL}${skaleNetwork}/logos/${logoName}`
}
