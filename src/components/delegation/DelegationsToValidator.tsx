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
import { useState as useReactState } from 'react'

import { Collapse, Button } from '@mui/material'

import { types } from '@/core'

import { getValidatorById, DelegationState } from '../../core/delegation'

import Delegation from './Delegation'
import Reward from './Reward'

export default function DelegationsToValidator(props: {
  delegationsToValidator: types.st.IDelegationsToValidator
  validators: types.st.IValidator[]
  delegationType: types.st.DelegationType
  retrieveRewards: (rewardInfo: types.st.IRewardInfo) => Promise<void>
  loading: types.st.IRewardInfo | types.st.IDelegationInfo | false
  unstake: (delegationInfo: types.st.IDelegationInfo) => Promise<void>
  cancelRequest: (delegationInfo: types.st.IDelegationInfo) => Promise<void>
  address: types.AddressType | undefined
  customAddress: types.AddressType | undefined
  customRewardAddress: types.AddressType | undefined
  setCustomRewardAddress: (customRewardAddress: types.AddressType | undefined) => void
  sklPrice: bigint
}) {
  const [open, setOpen] = useState(true)
  const validator = getValidatorById(props.validators, props.delegationsToValidator.validatorId)
  if (!validator) return

  const [groupUnstakeLoading, setGroupUnstakeLoading] = useReactState(false)

  const handleUnstakeAll = async () => {
    setGroupUnstakeLoading(true)
    try {
      const activeDelegations = props.delegationsToValidator.delegations.filter(
        (delegation) => Number(delegation.stateId) === DelegationState.DELEGATED
      )
      for (const delegation of activeDelegations) {
        await props.unstake({
          delegationId: delegation.id,
          delegationType: props.delegationType
        })
      }
    } finally {
      setGroupUnstakeLoading(false)
    }
  }

  const hasActiveDelegations = props.delegationsToValidator.delegations.some(
    (delegation) => Number(delegation.stateId) === DelegationState.DELEGATED
  )
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
        address={props.address}
        customAddress={props.customAddress}
        customRewardAddress={props.customRewardAddress}
        setCustomRewardAddress={props.setCustomRewardAddress}
        unstakeAllBtn={
          hasActiveDelegations ? (
            <Button
              size="small"
              onClick={handleUnstakeAll}
              disabled={
                props.loading !== false || groupUnstakeLoading || props.customAddress !== undefined
              }
              className="font-sans! bg-destructive/10! py-2! px-3! capitalize! text-destructive! font-semibold! text-xs! ease-in-out transition-transform duration-150 active:scale-[0.97] hover:scale-[1.01] disabled:bg-secondary-foreground/10! disabled:text-foreground! disabled:cursor-not-allowed! disabled:transform-none! disabled:hover:scale-100!"
            >
              {groupUnstakeLoading ? 'Unstaking all...' : 'Unstake All'}
            </Button>
          ) : null
        }
        sklPrice={props.sklPrice}
      />
      <div className="border-l-2 border-border"></div>
      <Collapse in={open}>
        <div className="relative">
          <div className="border-l-2 border-border absolute left-10 top-0 bottom-0"></div>
          <div className="pl-14 pr-0! sm:pr-5">
            {props.delegationsToValidator.delegations.map(
              (delegation: types.st.IDelegation, index: number) => (
                <Delegation
                  key={index}
                  delegation={delegation}
                  validator={validator}
                  delegationType={props.delegationType}
                  unstake={props.unstake}
                  cancelRequest={props.cancelRequest}
                  loading={props.loading}
                  customAddress={props.customAddress}
                  sklPrice={props.sklPrice}
                  isValidatorPage={false}
                />
              )
            )}
          </div>
        </div>
      </Collapse>
    </div>
  )
}
