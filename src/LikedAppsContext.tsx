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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */
/**
 * @file LikedAppsContext.tsx
 * @copyright SKALE Labs 2024-Present
 */
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react'
import { useWagmiAccount } from '@skalenetwork/metaport'
import { useAuth } from './AuthContext'
import { API_URL, LIKES_REFRESH_INTERVAL, MAX_APPS_DEFAULT } from './core/constants'
import { types } from '@/core'

interface AppLikes {
  [appId: string]: number
}

interface LikedAppsContextType {
  likedApps: string[]
  appLikes: AppLikes
  isLoading: boolean
  error: string | null
  toggleLikedApp: (appId: string) => Promise<void>
  refreshLikedApps: () => Promise<void>
  getAppId: (chainName: string, appName: string) => string
  getAppInfoById: (appId: string) => types.IAppId
  getMostLikedApps: () => string[]
  getMostLikedRank: (mostLikedAppIds: string[], appId: string) => number | undefined
}

const LikedAppsContext = createContext<LikedAppsContextType | undefined>(undefined)

export const LikedAppsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [likedApps, setLikedApps] = useState<string[]>([])
  const [appLikes, setAppLikes] = useState<AppLikes>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { address } = useWagmiAccount()
  const { isSignedIn } = useAuth()

  const fetchLikedApps = useCallback(async () => {
    if (!isSignedIn || !address) {
      setLikedApps([])
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_URL}/apps/liked`, {
        credentials: 'include'
      })
      if (!response.ok) {
        throw new Error('Failed to fetch liked apps')
      }
      const data = await response.json()
      setLikedApps(data.liked_apps)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }, [isSignedIn, address])

  const fetchAppLikes = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/apps/all`)
      if (!response.ok) {
        throw new Error('Failed to fetch app likes')
      }
      const data = await response.json()
      setAppLikes(data)
    } catch (err) {
      console.error('Error fetching app likes:', err)
    }
  }, [])

  const toggleLikedApp = async (appId: string) => {
    const isLiked = likedApps.includes(appId)
    const endpoint = isLiked ? `${API_URL}/apps/unlike` : `${API_URL}/apps/like`
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ app_id: appId }),
        credentials: 'include'
      })
      if (!response.ok) {
        throw new Error('Failed to update liked status')
      }

      setLikedApps((prev) => (isLiked ? prev.filter((id) => id !== appId) : [...prev, appId]))
      await fetchAppLikes()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  useEffect(() => {
    fetchAppLikes()
    const interval = setInterval(fetchAppLikes, LIKES_REFRESH_INTERVAL)
    return () => clearInterval(interval)
  }, [fetchAppLikes])

  useEffect(() => {
    if (isSignedIn && address) {
      fetchLikedApps()
    } else {
      setLikedApps([])
      setIsLoading(false)
    }
  }, [isSignedIn, address, fetchLikedApps])

  const getAppId = (chainName: string, appName: string) => `${chainName}--${appName}`
  const getAppInfoById = (appId: string) => {
    const [chain, app] = appId.split('--')
    return { chain, app }
  }

  const getMostLikedApps = useCallback(() => {
    return Object.entries(appLikes)
      .sort(([, likesA], [, likesB]) => likesB - likesA)
      .slice(0, MAX_APPS_DEFAULT)
      .map(([appId]) => appId)
  }, [appLikes])

  const getMostLikedRank = (mostLikedAppIds: string[], appId: string): number | undefined => {
    const idx = mostLikedAppIds.indexOf(appId)
    return idx === -1 ? undefined : idx + 1
  }

  return (
    <LikedAppsContext.Provider
      value={{
        likedApps,
        appLikes,
        isLoading,
        error,
        toggleLikedApp,
        refreshLikedApps: fetchLikedApps,
        getAppId,
        getAppInfoById,
        getMostLikedApps,
        getMostLikedRank
      }}
    >
      {children}
    </LikedAppsContext.Provider>
  )
}

export const useLikedApps = () => {
  const context = useContext(LikedAppsContext)
  if (context === undefined) {
    throw new Error('useLikedApps must be used within a LikedAppsProvider')
  }
  return context
}
