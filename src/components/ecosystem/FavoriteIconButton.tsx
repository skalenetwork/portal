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
 * @file FavoriteIconButton.tsx
 * @copyright SKALE Labs 2024-Present
 */

import React from 'react'
import { IconButton, Tooltip } from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { useWagmiAccount, useConnectModal } from '@skalenetwork/metaport'
import { useLikedApps } from '../../LikedAppsContext'
import { useAuth } from '../../AuthContext'

interface FavoriteIconButtonProps {
  chainName: string
  appName: string
}

const FavoriteIconButton: React.FC<FavoriteIconButtonProps> = ({ chainName, appName }) => {
  const { likedApps, toggleLikedApp, refreshLikedApps, getAppId } = useLikedApps()
  const { isSignedIn, handleSignIn } = useAuth()
  const { address } = useWagmiAccount()
  const { openConnectModal } = useConnectModal()
  const appId = getAppId(chainName, appName)
  const isLiked = likedApps.includes(appId)

  const handleToggleLike = async () => {
    if (!address) {
      openConnectModal?.()
      return
    }
    if (!isSignedIn) {
      await handleSignIn()
      return
    }
    await toggleLikedApp(appId)
    refreshLikedApps()
  }

  const getTooltipTitle = () => {
    if (!isSignedIn) return 'Sign in to add to favorites'
    return isLiked ? 'Remove from favorites' : 'Add to favorites'
  }

  return (
    <Tooltip title={getTooltipTitle()}>
      <IconButton onClick={handleToggleLike} className="'bgPrim'">
        {isLiked ? (
          <FavoriteIcon className="iconRed" />
        ) : (
          <FavoriteBorderIcon className="text-secondary" />
        )}
      </IconButton>
    </Tooltip>
  )
}

export default FavoriteIconButton
