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
 * @file DelegationsToValidator.tsx
 * @copyright SKALE Labs 2024-Present
 */

import { useState } from 'react'
import { cls, type interfaces } from '@skalenetwork/metaport'
import { Collapse } from '@mui/material'
import {
  type DelegationType,
  type IDelegation,
  type IDelegationInfo,
  type IDelegationsToValidator,
  type IRewardInfo,
  type IValidator
} from '../../core/interfaces'

import Delegation from './Delegation'
import Reward from './Reward'

export default function DelegationsToValidator(props: {
  delegationsToValidator: IDelegationsToValidator
  validators: IValidator[]
  delegationType: DelegationType
  retrieveRewards: (rewardInfo: IRewardInfo) => Promise<void>
  loading: IRewardInfo | IDelegationInfo | false
  unstake: (delegationInfo: IDelegationInfo) => Promise<void>
  cancelRequest: (delegationInfo: IDelegationInfo) => Promise<void>
  isXs: boolean
  address: interfaces.AddressType | undefined
  customAddress: interfaces.AddressType | undefined
  customRewardAddress: interfaces.AddressType | undefined
  setCustomRewardAddress: (customRewardAddress: interfaces.AddressType | undefined) => void
}) {
  const [open, setOpen] = useState(true)
  return (
    <div>
      <Reward
        open={open}
        setOpen={setOpen}
        validators={props.validators}
        delegationsToValidator={props.delegationsToValidator}
        retrieveRewards={props.retrieveRewards}
        loading={props.loading}
        delegationType={props.delegationType}
        isXs={props.isXs}
        address={props.address}
        customAddress={props.customAddress}
        customRewardAddress={props.customRewardAddress}
        setCustomRewardAddress={props.setCustomRewardAddress}
      />

      <Collapse in={open}>
        <div className={cls('nestedSection', ['nestedSectionXs', props.isXs])}>
          {props.delegationsToValidator.delegations.map(
            (delegation: IDelegation, index: number) => (
              <Delegation
                key={index}
                delegation={delegation}
                validators={props.validators}
                delegationType={props.delegationType}
                unstake={props.unstake}
                cancelRequest={props.cancelRequest}
                loading={props.loading}
                isXs={props.isXs}
                customAddress={props.customAddress}
              />
            )
          )}
        </div>
      </Collapse>
    </div>
  )
}
