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
import { getRecentApps } from './core/ecosystem/utils'
import { MAX_APPS_DEFAULT } from './core/constants'
import { useLikedApps } from './LikedAppsContext'
import { useAuth } from './AuthContext'

export function useApps(chainsMeta: types.ChainsMetadataMap) {
  const { getTrendingApps, likedApps, getAppId } = useLikedApps()
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

  const newApps = useMemo<types.AppWithChainAndName[]>(() => {
    const apps = getRecentApps(chainsMeta, MAX_APPS_DEFAULT)
    return apps.sort((a, b) => (b.added || 0) - (a.added || 0))
  }, [chainsMeta])

  const trendingAppIds = getTrendingApps()

  const trendingApps = useMemo<types.AppWithChainAndName[]>(() => {
    const appMap = new Map(allApps.map((app) => [getAppId(app.chain, app.appName), app]))
    return trendingAppIds
      .map((id) => appMap.get(id))
      .filter((app): app is types.AppWithChainAndName => app !== undefined)
  }, [allApps, trendingAppIds, getAppId])

  const favoriteApps = useMemo<types.AppWithChainAndName[]>(() => {
    if (!isSignedIn) return []
    const apps = allApps.filter((app) => likedApps.includes(getAppId(app.chain, app.appName)))
    return apps.sort((a, b) => a.alias.localeCompare(b.alias))
  }, [allApps, likedApps, isSignedIn, getAppId])

  return { allApps, newApps, trendingApps, favoriteApps, isSignedIn }
}
