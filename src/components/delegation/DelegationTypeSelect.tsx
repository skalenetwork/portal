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
 * @file DelegationTypeSelect.tsx
 * @copyright SKALE Labs 2024-Present
 */

import NativeSelect from '@mui/material/NativeSelect'
import { types } from '@/core'
import { isDelegationTypeAvailable } from '../../core/delegation/staking'

export default function DelegationTypeSelect(props: {
  delegationType: types.st.DelegationType
  handleChange: (event: any) => void
  si: types.st.StakingInfoMap
}) {
  const hasEscrow = isDelegationTypeAvailable(props.si, types.st.DelegationType.ESCROW)
  const hasGrant = isDelegationTypeAvailable(props.si, types.st.DelegationType.ESCROW2)
  const hasEscrowOrGrant = hasEscrow || hasGrant

  if (!hasEscrowOrGrant) {
    return null
  }

  return (
    <div className="sk-select">
      <NativeSelect
        className="text-xs! titleBadge"
        defaultValue={30}
        value={props.delegationType}
        onChange={props.handleChange}
      >
        <option value={types.st.DelegationType.REGULAR} className="text-xs!">
          Regular delegation
        </option>
        {hasEscrow ? (
          <option value={types.st.DelegationType.ESCROW} className="text-xs">
            Escrow delegation
          </option>
        ) : null}
        {hasGrant ? (
          <option value={types.st.DelegationType.ESCROW2} className="text-xs">
            Grant delegation
          </option>
        ) : null}
      </NativeSelect>
    </div>
  )
}
