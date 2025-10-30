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
 * @file ProfileModalActions.tsx
 * @copyright SKALE Labs 2024-Present
 */

import React from 'react'
import { Button } from '@mui/material'
import { RainbowConnectButton, useWagmiDisconnect } from '@skalenetwork/metaport'
import SkStack from '../SkStack'
import LaunchIcon from '@mui/icons-material/Launch'
import LooksRoundedIcon from '@mui/icons-material/LooksRounded'
import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'
import PowerOffIcon from '@mui/icons-material/PowerOff'

interface ProfileModalActionsProps {
  address: string
  isSignedIn: boolean
  isMobile: boolean
  handleSignIn: () => void
  handleSignOut: () => void
  className?: string
}

const ProfileModalActions: React.FC<ProfileModalActionsProps> = ({
  address,
  isSignedIn,
  isMobile,
  handleSignIn,
  handleSignOut
}) => {
  const { disconnect } = useWagmiDisconnect()

  return (
    <SkStack className="className, 'profileModalActions'">
      <Button
        variant="text"
        startIcon={<LaunchIcon />}
        className="'btn', 'btnSm', 'filled'"
        onClick={() => window.open(`https://etherscan.io/address/${address}`, '_blank')}
        fullWidth={isMobile}
      >
        View on Etherscan
      </Button>

      <RainbowConnectButton.Custom>
        {({ openAccountModal }) => (
          <Button
            variant="text"
            startIcon={<LooksRoundedIcon />}
            className="'btn', 'btnSm', 'filled'"
            onClick={openAccountModal}
            fullWidth={isMobile}
          >
            Manage Wallet
          </Button>
        )}
      </RainbowConnectButton.Custom>

      <Button
        variant="text"
        startIcon={<PowerOffIcon />}
        className="'btn', 'btnSm', 'filled'"
        onClick={() => disconnect()}
        fullWidth={isMobile}
      >
        Disconnect
      </Button>

      <Button
        variant="text"
        startIcon={isSignedIn ? <LogoutIcon /> : <LoginIcon />}
        className="'btn', 'btnSm', 'filled'"
        onClick={isSignedIn ? handleSignOut : handleSignIn}
        fullWidth={isMobile}
      >
        {isSignedIn ? 'Sign out' : 'Sign in'}
      </Button>
    </SkStack>
  )
}

export default ProfileModalActions
