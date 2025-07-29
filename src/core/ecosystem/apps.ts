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

import { type types, metadata } from '@/core'

const SWELL_CHAIN = '__offchain'
const SWELL_APP = 'swell'

export function sortAndFilterApps(apps: types.AppWithChainAndName[]): types.AppWithChainAndName[] {
  const swellAppIndex = apps.findIndex(
    (app) => app.chain === SWELL_CHAIN && app.appName === SWELL_APP
  )
  let swellApp: types.AppWithChainAndName | null = null
  if (swellAppIndex !== -1) {
    swellApp = apps.splice(swellAppIndex, 1)[0]
  }
  const sortedApps = apps.sort((a, b) => a.alias.localeCompare(b.alias))
  if (swellApp) {
    sortedApps.unshift(swellApp)
  }
  return sortedApps
}

export function filterAppsByCategory(
  apps: types.AppWithChainAndName[],
  checkedItems: string[]
): types.AppWithChainAndName[] {
  if (checkedItems.length === 0) return sortAndFilterApps(apps)
  const filteredApps = apps.filter((app) => {
    if (!app.categories || Object.keys(app.categories).length === 0) return false
    return Object.entries(app.categories).some(([category, subcategories]) => {
      if (checkedItems.includes(category)) return true
      if (Array.isArray(subcategories)) {
        return subcategories.some((subcategory) => {
          const subcategoryKey = `${category}_${subcategory}`
          return checkedItems.includes(subcategoryKey)
        })
      }
      return false
    })
  })
  return sortAndFilterApps(filteredApps)
}

export function filterAppsBySearchTerm(
  apps: types.AppWithChainAndName[],
  searchTerm: string,
  chainsMeta: types.ChainsMetadataMap
): types.AppWithChainAndName[] {
  if (!searchTerm || searchTerm === '') return sortAndFilterApps(apps)
  const st = searchTerm.toLowerCase()
  const filteredApps = apps.filter(
    (app) =>
      app.alias.toLowerCase().includes(st) ||
      app.chain.toLowerCase().includes(st) ||
      metadata.getAlias(chainsMeta, app.chain).toLowerCase().includes(st)
  )
  return sortAndFilterApps(filteredApps)
}

export function filterAppsByChains(
  apps: types.AppWithChainAndName[],
  chains: string[]
): types.AppWithChainAndName[] {
  if (chains.length === 0) return sortAndFilterApps(apps)
  const filteredApps = apps.filter((app) => chains.includes(app.chain))
  return sortAndFilterApps(filteredApps)
}

export function getAppMeta(
  chainsMeta: types.ChainsMetadataMap,
  chain: string,
  app: string
): types.AppMetadata | undefined {
  return chainsMeta[chain]?.apps?.[app]
}

export function getAppMetaWithChainApp(
  chainsMeta: types.ChainsMetadataMap,
  chain: string,
  app: string
): types.AppWithChainAndName | undefined {
  const meta = chainsMeta[chain]?.apps?.[app]
  if (!meta) return undefined
  return {
    ...meta,
    chain,
    appName: app
  }
}
