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
 * @copyright SKALE Labs 2025-Present
 */

import { types } from ".."
import { BASE_METADATA_URL, MAINNET_CHAIN_NAME } from "../constants"
import { AppMetadata } from "../types"

export function chainBg(
    chainsMeta: types.ChainsMetadataMap,
    chainName: string,
    app?: string
): string | undefined {
    const chainData = chainsMeta[chainName]

    if (chainData) {
        const appData = chainData.apps && app ? chainData.apps[app] : null

        return appData?.gradientBackground || chainData.gradientBackground || chainData.background
    }

    return 'linear-gradient(273.67deg, rgb(47 50 80), rgb(39 43 68))'
}

export function getAlias(
    chainsMeta: types.ChainsMetadataMap,
    chainName: string,
    app?: string,
    short?: boolean
): string {
    if (chainName === MAINNET_CHAIN_NAME) {
        return 'Ethereum'
    }
    const chainData = chainsMeta?.[chainName]
    const appData = app ? chainData?.apps?.[app] : null
    const alias = appData?.alias || chainData?.alias || transformChainName(chainName)
    return short ? alias.split(' ')[0] : alias
}


export function getChainApps(
    chainsMeta: types.ChainsMetadataMap,
    chainName: string
) {
    if (chainsMeta[chainName] && chainsMeta[chainName].apps) {
        return chainsMeta[chainName].apps
    }
}


export function transformChainName(chainName: string): string {
    return chainName
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
}

export function isPreTge(appMeta: AppMetadata): boolean {
    if (appMeta.pretge) {
        const now = Math.floor(Date.now() / 1000)
        return now >= appMeta.pretge.from && now <= appMeta.pretge.to
    }
    if ('pretge' in appMeta.categories) return true
    return false
}

export async function loadMeta(skaleNetwork: types.SkaleNetwork): Promise<types.ChainsMetadataMap> {
    const response = await fetch(`${BASE_METADATA_URL}${skaleNetwork}/chains.json`)
    return await response.json()
}

export function getMetaLogoUrl(skaleNetwork: types.SkaleNetwork, logoName: string): string {
    return `${BASE_METADATA_URL}${skaleNetwork}/logos/${logoName}`
}

export function getChainShortAlias(meta: types.ChainsMetadataMap, name: string): string {
    return meta[name]?.shortAlias !== undefined ? meta[name].shortAlias! : name
}

export function getChainDescription(meta: types.ChainMetadata | undefined): string {
    return meta && meta.description ? meta.description : 'No description'
}

export function findChainName(meta: types.ChainsMetadataMap, name: string): string {
    for (const key in meta) {
        if (meta[key].shortAlias === name) {
            return key
        }
    }
    return name
}
