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
 * @file Reward.tsx
 * @copyright SKALE Labs 2024-Present
 */

import { types, units } from '@/core'

import { Tooltip, Button } from '@mui/material'

import ValidatorLogo from './ValidatorLogo'

import { getValidatorById } from '../../core/delegation'
import RetrieveRewardModal from './RetrieveRewardModal'
import { CircleMinus, CirclePlus } from 'lucide-react'

export default function Reward(props: {
  validators: types.st.IValidator[]
  delegationsToValidator: types.st.IDelegationsToValidator
  setOpen: (open: boolean) => void
  open: boolean
  retrieveRewards: (rewardInfo: types.st.IRewardInfo) => Promise<void>
  loading: types.st.IRewardInfo | types.st.IDelegationInfo | false
  delegationType: types.st.DelegationType
  address: types.AddressType | undefined
  customAddress: types.AddressType | undefined
  customRewardAddress: types.AddressType | undefined
  setCustomRewardAddress: (customRewardAddress: types.AddressType | undefined) => void
  unstakeAllBtn?: React.ReactNode
  sklPrice: bigint
}) {
  const validator = getValidatorById(props.validators, props.delegationsToValidator.validatorId)
  const rewardsAmount = units.displayBalance(props.delegationsToValidator.rewards, 'SKL')
  const totalStakedAmount = units.displayBalance(props.delegationsToValidator.staked, 'SKL')
  if (!validator) return

  const loading =
    props.loading &&
    props.loading.delegationType === props.delegationType &&
    'validatorId' in props.loading &&
    props.loading.validatorId === validator.id

  const minimizeBtn = (
    <div
      className="ml-5 w-4 h-4 cursor-pointer"
      onClick={() => {
        props.setOpen(!props.open)
      }}
    >
      {props.open ? (
        <CircleMinus size={17} className="mr-1.5 text-secondary-foreground align-center" />
      ) : (
        <CirclePlus size={17} className="mr-1.5 text-secondary-foreground align-center" />
      )}
    </div>
  )

  function retrieveRewards() {
    if (!validator) return
    props.retrieveRewards({
      validatorId: validator.id,
      delegationType: props.delegationType
    })
  }

  const retrieveDisabled =
    props.delegationsToValidator.rewards === 0n ||
    props.loading !== false ||
    props.customAddress !== undefined

  return (
    <div>
      <div className="mb-2.5 titleSection">
        <div className="flex flex-col md:flex-row items-center gap-0">
          <div className="w-full md:w-1/3">
            <div className="flex items-center">
              <ValidatorLogo validatorId={validator.id} size="xxs" />
              <div className="ml-2.5 grow sm:grow-0">
                <h4 className="font-bold truncate text-foreground">{validator.name}</h4>
                <p className="text-xs text-secondary-foreground">
                  Validator ID: {Number(validator.id)}
                </p>
              </div>
              <div className="md:hidden">{minimizeBtn}</div>
            </div>
          </div>
          <div className="w-full md:w-2/3 mt-5 sm:mt-0">
            <div className="flex items-center">
              <div className="grow-0 sm:grow"></div>
              {!props.open && (
                <div className="hidden! md:flex!">
                  <div className="flex flex-col items-end justify-center w-full">
                    <p className="text-xs text-secondary-foreground">Total staked</p>
                    <Tooltip
                      arrow
                      title={
                        props.sklPrice !== undefined &&
                        props.delegationsToValidator.staked !== undefined
                          ? units.displaySklValueUsd(
                              props.delegationsToValidator.staked,
                              props.sklPrice
                            )
                          : ''
                      }
                    >
                      <h3 className="font-bold text-foreground">{totalStakedAmount}</h3>
                    </Tooltip>
                  </div>
                  <div className="border-l-2 border-border ml-2.5"></div>
                </div>
              )}
              <div className="grow mr-5 sm:grow-0 sm:ml-2.5 sm:mr-5">
                <div className="flex flex-col items-start sm:items-end justify-center w-full">
                  <p className="text-xs text-secondary-foreground">Rewards available</p>
                  <Tooltip
                    arrow
                    title={
                      props.sklPrice
                        ? units.displaySklValueUsd(
                            props.delegationsToValidator.rewards,
                            props.sklPrice
                          )
                        : ''
                    }
                  >
                    <h3 className="font-bold text-foreground">{rewardsAmount}</h3>
                  </Tooltip>
                </div>
              </div>
              <div className="flex items-center">
                {loading ? (
                  <Button
                    disabled
                    size="small"
                    variant="contained"
                    className="btnSm bg-accent-foreground! disabled:bg-muted-foreground/30! text-accent! disabled:text-muted!"
                  >
                    Retrieving
                  </Button>
                ) : (
                  <>
                    <RetrieveRewardModal
                      address={props.address}
                      disabled={retrieveDisabled}
                      customRewardAddress={props.customRewardAddress}
                      setCustomRewardAddress={props.setCustomRewardAddress}
                      retrieveRewards={retrieveRewards}
                      loading={loading}
                    />
                    {props.unstakeAllBtn && <span className="ml-2.5">{props.unstakeAllBtn}</span>}
                  </>
                )}
              </div>
              <div className="hidden md:block!">{minimizeBtn}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
