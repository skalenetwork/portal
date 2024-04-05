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
import Grid from '@mui/material/Grid'

import Loader from '../Loader'
import ValidatorCard from './ValidatorCard'
import { type DelegationType, type IValidator } from '../../core/interfaces'
import { ESCROW_VALIDATORS, filterValidators } from '../../core/delegation/validators'

export default function Validators(props: {
  mpc: MetaportCore
  validators: IValidator[]
  validatorId: number | undefined
  setValidatorId: any
  internal?: boolean
  delegationType: DelegationType
  size?: 'md' | 'lg'
}) {
  const size = props.size ?? 'md'
  const internal = props.internal ?? false

  if (!props.validators || props.validators.length === 0) {
    return <Loader text="Loading validators list" />
  }

  const validators = internal
    ? props.validators
    : filterValidators(props.validators, ESCROW_VALIDATORS, internal)

  return (
    <Grid container spacing={size === 'md' ? 2 : 3}>
      {validators.map((validator: IValidator, index) => (
        <ValidatorCard
          key={index}
          validator={validator}
          validatorId={props.validatorId}
          setValidatorId={props.setValidatorId}
          size={size}
          delegationType={props.delegationType}
        />
      ))}
    </Grid>
  )
}
