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
 * @file ProfileModal.tsx
 * @copyright SKALE Labs 2024-Present
 */

import React from 'react'
import { Modal, Box, useTheme, useMediaQuery } from '@mui/material'
import { cls, cmn, SkPaper, useWagmiAccount } from '@skalenetwork/metaport'
import { useAuth } from '../../AuthContext'
import Tile from '../Tile'
import ConnectWallet from '../ConnectWallet'
import ProfileModalHeader from './ProfileModalHeader'
import ProfileModalActions from './ProfileModalActions'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'

const ProfileModal: React.FC = () => {
  const { address } = useWagmiAccount()
  const { isSignedIn, handleSignIn, handleSignOut, isProfileModalOpen, closeProfileModal } =
    useAuth()

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const modalContent = (
    <Box className="profileModal">
      <SkPaper gray>
        <ProfileModalHeader address={address} isSignedIn={isSignedIn} />
        {!address ? (
          <ConnectWallet customText="Connect your wallet to use your profile" />
        ) : (
          <div></div>
        )}
        {address ? (
          <div>
            <Tile
              text="Wallet Address"
              value={address}
              icon={<Jazzicon diameter={20} seed={jsNumberForAddress(address)} />}
              copy={address}
              className={cls(cmn.mbott10)}
            />
            <ProfileModalActions
              className={cls(cmn.mtop20)}
              address={address}
              isSignedIn={isSignedIn}
              isMobile={isMobile}
              handleSignIn={handleSignIn}
              handleSignOut={handleSignOut}
            />
          </div>
        ) : (
          <div></div>
        )}
      </SkPaper>
    </Box>
  )

  return (
    <Modal
      open={isProfileModalOpen}
      onClose={closeProfileModal}
      aria-labelledby="profile-modal-title"
      aria-describedby="profile-modal-description"
    >
      {modalContent}
    </Modal>
  )
}

export default ProfileModal
