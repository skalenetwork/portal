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
 * @file ProfileModalHeader.tsx
 * @copyright SKALE Labs 2024-Present
 */

import React from 'react'
import { FiberManualRecord } from '@mui/icons-material'
import { cls, cmn } from '@skalenetwork/metaport'
import Headline from '../Headline'
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded'

interface ProfileModalHeaderProps {
  address: string | undefined
}

const ProfileModalHeader: React.FC<ProfileModalHeaderProps> = ({ address }) => (
  <div className={cls('profileModalHeader', cmn.flexcv)}>
    <div className={cls(cmn.flexg)}>
      <Headline text="Profile" icon={<AccountCircleRoundedIcon />} size="small" />
    </div>
    <div className="profileModalStatus">
      <FiberManualRecord
        className={cls(cmn.mri5)}
        fontSize="small"
        color={address ? 'success' : 'error'}
      />
      <p className={cls(cmn.p, cmn.p4, 'pSec', cmn.mri20)}>
        {address ? 'Connected' : 'Not connected'}
      </p>
    </div>
  </div>
)

export default ProfileModalHeader
