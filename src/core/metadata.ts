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

import { type types } from '@/core'
import { BASE_METADATA_URL } from './constants'
import { AppMetadata } from '@/core/dist/types'

export async function loadMeta(skaleNetwork: types.SkaleNetwork): Promise<types.ChainsMetadataMap> {
  const response = await fetch(`${BASE_METADATA_URL}${skaleNetwork}/chains.json`)
  return await response.json()
}

export function getMetaLogoUrl(skaleNetwork: types.SkaleNetwork, logoName: string): string {
  return `${BASE_METADATA_URL}${skaleNetwork}/logos/${logoName}`
}

export function isPreTge(appMeta: AppMetadata): boolean {
  if (appMeta.pretge) {
    const now = Math.floor(Date.now() / 1000)
    return now >= appMeta.pretge.from && now <= appMeta.pretge.to
  }
  if ('pretge' in appMeta.categories) return true
  return false
}
