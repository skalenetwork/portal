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

import { cmn, cls } from '@skalenetwork/metaport'

import NativeSelect from '@mui/material/NativeSelect'
import { isDelegationTypeAvailable } from '../../core/delegation/staking'
import { types } from '@/core'

export default function DelegationTypeSelect(props: {
  delegationType: types.staking.DelegationType
  handleChange: (event: any) => void
  si: types.staking.StakingInfoMap
}) {
  return (
    <div className="sk-select">
      <NativeSelect
        className={cls(cmn.p, cmn.p4, 'titleBadge')}
        defaultValue={30}
        value={props.delegationType}
        onChange={props.handleChange}
      >
        <option value={types.staking.DelegationType.REGULAR} className={cls(cmn.p, cmn.p4)}>
          Regular delegation
        </option>
        {isDelegationTypeAvailable(props.si, types.staking.DelegationType.ESCROW) ? (
          <option value={types.staking.DelegationType.ESCROW} className={cls(cmn.p, cmn.p4)}>
            Escrow delegation
          </option>
        ) : null}
        {isDelegationTypeAvailable(props.si, types.staking.DelegationType.ESCROW2) ? (
          <option value={types.staking.DelegationType.ESCROW2} className={cls(cmn.p, cmn.p4)}>
            Grant delegation
          </option>
        ) : null}
      </NativeSelect>
    </div>
  )
}
