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
 * @file DelegationsNotification.tsx
 * @copyright SKALE Labs 2024-Present
 */

import { cls, cmn } from '@skalenetwork/metaport'
import { types } from '@/core'

import { getProposedDelegationsCount } from '../../core/delegation'
import { Tooltip } from '@mui/material'

export default function DelegationsNotification(props: {
  validatorDelegations: types.st.IDelegation[] | null
  className?: string
}) {
  const proposedDelegations = getProposedDelegationsCount(props.validatorDelegations)

  if (proposedDelegations && proposedDelegations > 0) {
    return (
      <Tooltip
        title={`You have ${proposedDelegations} pending delegation${
          proposedDelegations > 1 && 's'
        }`}
      >
        <div className={cls(props.className, 'chipNotification')}>
          <p className={cls(cmn.p, cmn.p5)}>{proposedDelegations}</p>
        </div>
      </Tooltip>
    )
  }
}
