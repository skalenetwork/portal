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
import { cls } from '@skalenetwork/metaport'
import { Collapse } from '@mui/material'

import { types } from '@/core'

import { getValidatorById } from '../../core/delegation'

import Delegation from './Delegation'
import Reward from './Reward'

export default function DelegationsToValidator(props: {
  delegationsToValidator: types.staking.IDelegationsToValidator
  validators: types.staking.IValidator[]
  delegationType: types.staking.DelegationType
  retrieveRewards: (rewardInfo: types.staking.IRewardInfo) => Promise<void>
  loading: types.staking.IRewardInfo | types.staking.IDelegationInfo | false
  unstake: (delegationInfo: types.staking.IDelegationInfo) => Promise<void>
  cancelRequest: (delegationInfo: types.staking.IDelegationInfo) => Promise<void>
  isXs: boolean
  address: types.AddressType | undefined
  customAddress: types.AddressType | undefined
  customRewardAddress: types.AddressType | undefined
  setCustomRewardAddress: (customRewardAddress: types.AddressType | undefined) => void
}) {
  const [open, setOpen] = useState(true)
  const validator = getValidatorById(props.validators, props.delegationsToValidator.validatorId)
  if (!validator) return
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
            (delegation: types.staking.IDelegation, index: number) => (
              <Delegation
                key={index}
                delegation={delegation}
                validator={validator}
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
