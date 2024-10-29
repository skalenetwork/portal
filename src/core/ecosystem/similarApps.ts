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
 * @file similarApps.tsx
 * @copyright SKALE Labs 2024-Present
 */

import { type types } from '@/core'
import { APP_SUBCATEGORY_MATCH_WEIGHT, MAX_APPS_DEFAULT } from '../constants'

interface CategoryMatch {
  categoryMatches: number
  subcategoryMatches: number
  totalScore: number
}

interface SimilarApp extends types.AppWithChainAndName {
  score: number
}

function calculateCategoryMatches(
  sourceApp: types.AppWithChainAndName,
  targetApp: types.AppWithChainAndName
): CategoryMatch {
  let categoryMatches = 0
  let subcategoryMatches = 0

  Object.entries(sourceApp.categories).forEach(([category, sourceSubcategories]) => {
    if (category in targetApp.categories) {
      categoryMatches++
      const targetSubcategories = targetApp.categories[category]
      if (Array.isArray(sourceSubcategories) && Array.isArray(targetSubcategories)) {
        const matches = sourceSubcategories.filter((sub) =>
          targetSubcategories.includes(sub)
        ).length
        subcategoryMatches += matches
      }
    }
  })

  const totalScore = categoryMatches + subcategoryMatches * APP_SUBCATEGORY_MATCH_WEIGHT
  return { categoryMatches, subcategoryMatches, totalScore }
}

function isAppInList(app: types.AppWithChainAndName, list: types.AppWithChainAndName[]): boolean {
  return list.some((item) => item.chain === app.chain && item.appName === app.appName)
}

function findSimilarApps(
  currentApp: types.AppWithChainAndName | undefined,
  allApps: types.AppWithChainAndName[],
  favoriteApps: types.AppWithChainAndName[] = [],
  limit: number = MAX_APPS_DEFAULT
): SimilarApp[] {
  const apps = allApps.filter((app) => {
    if (currentApp && app.chain === currentApp.chain && app.appName === currentApp.appName) {
      return false
    }
    return !isAppInList(app, favoriteApps)
  })

  const targetApps = currentApp ? [currentApp] : favoriteApps
  if (!targetApps.length) return []

  const appScores: SimilarApp[] = apps.map((app) => {
    const scores = targetApps.map((targetApp) => calculateCategoryMatches(targetApp, app))

    const maxScore = Math.max(...scores.map((s) => s.totalScore))
    return { ...app, score: maxScore }
  })

  return appScores
    .filter((app) => app.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

export { findSimilarApps, type SimilarApp }
