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
 * @file Validators.tsx
 * @copyright SKALE Labs 2024-Present
 */

import { type MetaportCore } from '@skalenetwork/metaport'
import { types } from '@/core'

import Loader from '../Loader'
import ValidatorCard from './ValidatorCard'
import { ESCROW_VALIDATORS, filterValidators } from '../../core/delegation/validators'

export default function Validators(props: {
  mpc: MetaportCore
  validators: types.st.IValidator[]
  validatorId: number | undefined
  setValidatorId: any
  internal?: boolean
  delegationType: types.st.DelegationType
  size?: 'md' | 'lg'
  showButton?: boolean
}) {
  const size = props.size ?? 'md'
  const internal = props.internal ?? false
  const showButton = props.showButton ?? false

  if (!props.validators || props.validators.length === 0) {
    return <Loader text="Loading validators list" />
  }

  const validators = internal
    ? props.validators
    : filterValidators(props.validators, ESCROW_VALIDATORS, internal)

  const gridCols = showButton
    ? "grid grid-cols-1 sm:grid-cols-2 gap-4"  // 2 columns max for validators page with buttons
    : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"  // 3 columns max for stake page

  return (
    <div className={gridCols}>
      {validators.map((validator: types.st.IValidator) => (
          <ValidatorCard
            validator={validator}
            validatorId={props.validatorId}
            setValidatorId={props.setValidatorId}
            size={size}
            delegationType={props.delegationType}
            showButton={showButton}
          />
      ))}
    </div>
  )
}
