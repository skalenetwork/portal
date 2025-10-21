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
import { cls, cmn, SkPaper, useWagmiAccount, Tile } from '@skalenetwork/metaport'
import ConnectWallet from '../ConnectWallet'
import ProfileModalHeader from './ProfileModalHeader'
import ProfileModalActions from './ProfileModalActions'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { address } = useWagmiAccount()

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const modalContent = (
    <Box className="profileModal">
      <SkPaper gray>
        <ProfileModalHeader address={address} />
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
              isMobile={isMobile}     
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
      open={isOpen}
      onClose={onClose}
      aria-labelledby="profile-modal-title"
      aria-describedby="profile-modal-description"
    >
      {modalContent}
    </Modal>
  )
}

export default ProfileModal
