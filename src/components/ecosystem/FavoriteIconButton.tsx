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

import React, { useEffect } from 'react'
import { IconButton, Tooltip } from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { cls, cmn, useWagmiAccount, useConnectModal } from '@skalenetwork/metaport'
import { useLikedApps } from '../../LikedAppsContext'
import { useAuth } from '../../AuthContext'

interface FavoriteIconButtonProps {
  chainName: string
  appName: string
}

const FavoriteIconButton: React.FC<FavoriteIconButtonProps> = ({ chainName, appName }) => {
  const { likedApps, toggleLikedApp, refreshLikedApps, getAppId } = useLikedApps()
  const { isSignedIn, handleSignIn, getSignInStatus } = useAuth()
  const { address } = useWagmiAccount()
  const { openConnectModal } = useConnectModal()
  const appId = getAppId(chainName, appName)
  const isLiked = likedApps.includes(appId)

  const [asyncLike, setAsyncLike] = React.useState(false)

  const handleToggleLike = async () => {
    const status = await getSignInStatus()
    if (!status && address) handleSignIn()
    setAsyncLike(true)
  }

  const handleAsyncLike = async () => {
    if (!address) {
      openConnectModal?.()
      return
    }
    setAsyncLike(false)
    await toggleLikedApp(appId)
    refreshLikedApps()
  }

  useEffect(() => {
    if (asyncLike) handleAsyncLike()
  }, [address, isSignedIn, asyncLike])

  return (
    <Tooltip title={isLiked ? 'Remove from favorites' : 'Add to favorites'}>
      <IconButton onClick={handleToggleLike} className={cls('bgPrim')}>
        {isLiked ? (
          <FavoriteIcon className="iconRed" />
        ) : (
          <FavoriteBorderIcon className={cls(cmn.pSec)} />
        )}
      </IconButton>
    </Tooltip>
  )
}

export default FavoriteIconButton
