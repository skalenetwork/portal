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
 * @file ValidatorBadges.tsx
 * @copyright SKALE Labs 2024-Present
 */

import { cmn, cls } from '@skalenetwork/metaport'
import { types } from '@/core'

import Tooltip from '@mui/material/Tooltip'
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded'
import WarningRoundedIcon from '@mui/icons-material/WarningRounded'
import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded'
import { ESCROW_VALIDATORS } from '../../core/delegation/validators'

export function ValidatorBadge(props: { validator: types.st.IValidator; className?: string }) {
  if (ESCROW_VALIDATORS.includes(props.validator.id)) {
    return (
      <Tooltip title="Escrow validator">
        <AccountBalanceRoundedIcon
          className={cls('trustedBadge', cmn.mri5, cmn.pSec, props.className)}
        />
      </Tooltip>
    )
  }
  return null
}

export function TrustBadge(props: { validator: types.st.IValidator }) {
  if (props.validator.trusted) {
    return (
      <Tooltip title="Trusted validator">
        <VerifiedRoundedIcon className={cls('trustedBadge', cmn.mleft5)} />
      </Tooltip>
    )
  }
  return (
    <Tooltip title="Not verified validator">
      <WarningRoundedIcon className={cls('untrustedBadge', cmn.mleft5)} />
    </Tooltip>
  )
}
