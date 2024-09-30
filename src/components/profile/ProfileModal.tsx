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

import React, { useState, useCallback } from 'react'
import { Modal, Box, Grid, useTheme, useMediaQuery } from '@mui/material'
import { SkPaper, useWagmiAccount } from '@skalenetwork/metaport'
import { useAuth } from '../../AuthContext'
import Tile from '../Tile'
import Message from '../Message'
import ConnectWallet from '../ConnectWallet'
import ProfileModalHeader from './ProfileModalHeader'
import EmailSection from './EmailSection'
import SwellMessage from './SwellMessage'
import ProfileModalActions from './ProfileModalActions'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import EmailRoundedIcon from '@mui/icons-material/EmailRounded'

const ProfileModal: React.FC = () => {
  const { address } = useWagmiAccount()
  const {
    isSignedIn,
    email,
    isEmailLoading,
    isEmailUpdating,
    emailError,
    updateEmail,
    handleSignIn,
    handleSignOut,
    isProfileModalOpen,
    closeProfileModal
  } = useAuth()

  const [isEditing, setIsEditing] = useState(false)
  const [newEmail, setNewEmail] = useState(email || '')

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const handleStartEditing = useCallback(() => {
    setIsEditing(true)
    setNewEmail(email || '')
  }, [email])

  const handleCancelEditing = useCallback(() => {
    setIsEditing(false)
    setNewEmail(email || '')
  }, [email])

  const handleUpdateEmail = useCallback(async () => {
    if (newEmail.trim()) {
      await updateEmail(newEmail.trim())
      setIsEditing(false)
    }
  }, [newEmail, updateEmail])

  const modalContent = (
    <Box className="profileModal">
      <SkPaper gray>
        <ProfileModalHeader address={address} isSignedIn={isSignedIn} />

        {!address || !isSignedIn ? (
          <ConnectWallet customText="Connect your wallet and sign-in to use your profile" />
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Tile
                text="Wallet Address"
                value={address}
                icon={<Jazzicon diameter={20} seed={jsNumberForAddress(address)} />}
                copy={address}
              />
            </Grid>
            <Grid item xs={12}>
              <EmailSection
                email={email}
                isEditing={isEditing}
                isEmailLoading={isEmailLoading}
                isEmailUpdating={isEmailUpdating}
                newEmail={newEmail}
                setNewEmail={setNewEmail}
                handleStartEditing={handleStartEditing}
                handleUpdateEmail={handleUpdateEmail}
                handleCancelEditing={handleCancelEditing}
              />
            </Grid>
            {emailError && (
              <Grid item xs={12}>
                <Message text={emailError} type="error" icon={<EmailRoundedIcon />} closable={false} />
              </Grid>
            )}

            <Grid item xs={12}>
              <SwellMessage
                email={email}
                isEditing={isEditing}
                handleStartEditing={handleStartEditing}
              />
            </Grid>

            <Grid item xs={12}>
              <ProfileModalActions
                address={address}
                isSignedIn={isSignedIn}
                isMobile={isMobile}
                handleSignIn={handleSignIn}
                handleSignOut={handleSignOut}
              />
            </Grid>
          </Grid>
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
