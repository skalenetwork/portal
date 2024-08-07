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
 * @file apps.ts
 * @copyright SKALE Labs 2024-Present
 */

import { type types } from '@/core'

export interface AppWithChainAndName extends types.AppMetadata {
  chain: string
  appName: string
}

interface CategoryFilter {
  [key: string]: boolean
}

export function getAllApps(chainsMetadata: types.ChainsMetadataMap): AppWithChainAndName[] {
  const allApps: AppWithChainAndName[] = []

  for (const [chainName, chainData] of Object.entries(chainsMetadata)) {
    if (chainData.apps) {
      for (const [appName, appData] of Object.entries(chainData.apps)) {
        allApps.push({
          ...appData,
          chain: chainName,
          appName
        })
      }
    }
  }

  return allApps
}

export function sortAppsByAlias(apps: AppWithChainAndName[]): AppWithChainAndName[] {
  return apps.sort((a, b) => a.alias.localeCompare(b.alias))
}

export function filterAppsByCategory(
  apps: AppWithChainAndName[],
  filter: CategoryFilter
): AppWithChainAndName[] {
  if (Object.keys(filter).length === 0) return apps
  return apps.filter((app) => {
    if (!app.categories || Object.keys(app.categories).length === 0) return false
    return Object.entries(app.categories).some(([category, subcategories]) => {
      // Check if the main category is selected in the filter
      if (filter[category] === true) return true
      // If the main category isn't selected, check subcategories
      if (Array.isArray(subcategories)) {
        return subcategories.some((subcategory) => {
          const subcategoryKey = `${category}_${subcategory}`
          return filter[subcategoryKey] === true
        })
      }

      return false
    })
  })
}

export function filterAppsBySearchTerm(
  apps: AppWithChainAndName[],
  searchTerm: string
): AppWithChainAndName[] {
  if (!searchTerm || searchTerm === '') return apps
  return apps.filter(
    (app) =>
      app.alias.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.chain.toLowerCase().includes(searchTerm.toLowerCase())
  )
}
