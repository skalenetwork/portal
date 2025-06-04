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
 * @file useApps.tsx
 * @copyright SKALE Labs 2024-Present
 */

import { useMemo } from 'react'
import { type types } from '@/core'
import { explorer } from '@skalenetwork/metaport'
import { getRecentApps } from './core/ecosystem/utils'
import { MAX_APPS_DEFAULT } from './core/constants'
import { useLikedApps } from './LikedAppsContext'
import { useAuth } from './AuthContext'

export function useApps(chainsMeta: types.ChainsMetadataMap, metrics: types.IMetrics | null) {
  const { getMostLikedApps, likedApps, getAppId } = useLikedApps()
  const { isSignedIn } = useAuth()


  const allApps = useMemo<types.AppWithChainAndName[]>(() => {
    const apps = Object.entries(chainsMeta).flatMap(([chainName, chainData]) =>
      Object.entries(chainData.apps || {}).map(([appName, app]) => ({
        chain: chainName,
        appName,
        ...app
      }))
    )
    return apps.sort((a, b) => a.alias.localeCompare(b.alias))
  }, [chainsMeta])

  
  const featuredApps = useMemo<types.AppWithChainAndName[]>(() => {
    const filteredApps = allApps.filter(app => app.featured === true)
    console.log('Featured Apps:', filteredApps) 
    return filteredApps
  }, [allApps])

  const newApps = useMemo<types.AppWithChainAndName[]>(() => {
    const apps = getRecentApps(chainsMeta, MAX_APPS_DEFAULT)
    return apps.sort((a, b) => (b.added || 0) - (a.added || 0))
  }, [chainsMeta])

  const mostLikedAppIds = getMostLikedApps()
  const mostLikedApps = useMemo<types.AppWithChainAndName[]>(() => {
    const appMap = new Map(allApps.map((app) => [getAppId(app.chain, app.appName), app]))
    return mostLikedAppIds
      .map((id) => appMap.get(id))
      .filter((app): app is types.AppWithChainAndName => app !== undefined)
  }, [allApps, mostLikedAppIds, getAppId])

  const favoriteApps = useMemo<types.AppWithChainAndName[]>(() => {
    if (!isSignedIn) return []
    const apps = allApps.filter((app) => likedApps.includes(getAppId(app.chain, app.appName)))
    return apps.sort((a, b) => a.alias.localeCompare(b.alias))
  }, [allApps, likedApps, isSignedIn, getAppId])

  const trendingApps = useMemo<types.AppWithChainAndName[]>(() => {
    if (!metrics) return []

    const appsWithTransactions = allApps.map((app) => {
      const chainMetrics = metrics.metrics[app.chain]
      if (!chainMetrics || !chainMetrics.apps_counters[app.appName]) {
        return { ...app, transactions_last_7_days: 0 }
      }
      const totalCounters = explorer.getTotalAppCounters(chainMetrics.apps_counters[app.appName])
      return {
        ...app,
        transactions_last_7_days: totalCounters ? totalCounters.transactions_last_7_days : 0
      }
    })

    return appsWithTransactions
      .sort((a, b) => b.transactions_last_7_days - a.transactions_last_7_days)
      .slice(0, MAX_APPS_DEFAULT)
  }, [allApps, metrics])

  return { allApps, featuredApps, newApps, mostLikedApps, favoriteApps, trendingApps, isSignedIn}
}
