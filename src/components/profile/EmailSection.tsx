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
 * @file EmailSection.tsx
 * @copyright SKALE Labs 2024-Present
 */

import React, { useRef, useEffect } from 'react'
import { cls, cmn, styles } from '@skalenetwork/metaport'
import { TextField, Button } from '@mui/material'
import EmailRoundedIcon from '@mui/icons-material/EmailRounded'
import Tile from '../Tile'

interface EmailSectionProps {
  email: string | null
  isEditing: boolean
  isEmailLoading: boolean
  isEmailUpdating: boolean
  newEmail: string
  setNewEmail: (email: string) => void
  handleStartEditing: () => void
  handleUpdateEmail: () => void
  handleCancelEditing: () => void
  className?: string
}

const EmailSection: React.FC<EmailSectionProps> = ({
  email,
  isEditing,
  isEmailLoading,
  isEmailUpdating,
  newEmail,
  setNewEmail,
  handleStartEditing,
  handleUpdateEmail,
  handleCancelEditing,
  className
}) => {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  return (
    <Tile
      text="Email Address"
      className={cls(styles.inputAmount, className)}
      icon={<EmailRoundedIcon />}
      value={!isEditing ? email ?? 'Not set' : undefined}
      children={
        isEditing && (
          <TextField
            className="amountInput addressInput"
            fullWidth
            inputRef={inputRef}
            variant="standard"
            placeholder="example@test.com"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
        )
      }
      childrenRi={
        isEditing ? (
          <div className={cls(cmn.flex, cmn.flexcv)}>
            <Button
              variant="contained"
              className={cls('btnSm')}
              onClick={handleUpdateEmail}
              disabled={isEmailUpdating}
            >
              Save
            </Button>
            <Button
              variant="text"
              className={cls('btnSm', 'filled', cmn.mleft5)}
              onClick={handleCancelEditing}
            >
              Cancel
            </Button>
          </div>
        ) : (
          email && (
            <Button
              variant="text"
              className={cls('btnSm', 'filled')}
              onClick={handleStartEditing}
              disabled={isEmailLoading || isEmailUpdating}
            >
              Change
            </Button>
          )
        )
      }
    />
  )
}

export default EmailSection
