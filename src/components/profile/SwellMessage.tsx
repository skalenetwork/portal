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
 * @file SwellMessage.tsx
 * @copyright SKALE Labs 2024-Present
 */

import React from 'react'
import { Button, Link } from '@mui/material'
import { cls, cmn } from '@skalenetwork/metaport'
import Message from '../Message'
import SwellIcon from '../ecosystem/SwellIcon'
import { SKALE_SOCIAL_LINKS } from '../../core/constants'

interface SwellMessageProps {
  email: string | null
  isEditing: boolean
  handleStartEditing: () => void
}

const SwellMessage: React.FC<SwellMessageProps> = ({ email, isEditing, handleStartEditing }) => (
  <Message
    gray={false}
    icon={<SwellIcon color="primary" />}
    text={
      email
        ? 'Claim your quest rewards on SKALE Swell'
        : 'Add your email to complete profile and claim rewards'
    }
    closable={false}
    button={
      email ? (
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href={SKALE_SOCIAL_LINKS.swell}
          className={cls(cmn.mleft5)}
        >
          <Button className={cls('btn btnSm')} variant="contained">
            Claim Rewards
          </Button>
        </Link>
      ) : !isEditing ? (
        <Button className={cls('btn btnSm')} variant="contained" onClick={handleStartEditing}>
          Add Email
        </Button>
      ) : null
    }
  />
)

export default SwellMessage
