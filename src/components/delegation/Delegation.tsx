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
 * @file Delegation.tsx
 * @copyright SKALE Labs 2024-Present
 */

import { useState } from 'react'
import Avatar from 'boring-avatars'
import { types, units, timeUtils } from '@/core'
import { cls, Tile } from '@skalenetwork/metaport'

import { Grid, Collapse, Tooltip } from '@mui/material'
import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded'
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded'
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded'

import SkStack from '../SkStack'
import SkBtn from '../SkBtn'
import ValidatorLogo from './ValidatorLogo'

import {
  DelegationSource,
  DelegationState,
  getDelegationSource,
  getKeyByValue
} from '../../core/delegation'
import { formatBigIntTimestampSeconds } from '../../core/timeHelper'
import { AVATAR_COLORS } from '../../core/constants'
import { Coins, ChevronRight, ChevronDown } from 'lucide-react'

export default function Delegation(props: {
  delegation: types.st.IDelegation
  validator: types.st.IValidator
  delegationType: types.st.DelegationType
  accept?: (delegationInfo: types.st.IDelegationInfo) => Promise<void>
  unstake?: (delegationInfo: types.st.IDelegationInfo) => Promise<void>
  cancelRequest?: (delegationInfo: types.st.IDelegationInfo) => Promise<void>
  loading: types.st.IRewardInfo | types.st.IDelegationInfo | false
  isXs: boolean
  customAddress: types.AddressType | undefined
  isValidatorPage?: boolean
  sklPrice: bigint
}) {
  const source = getDelegationSource(props.delegation)
  const delegationAmount = units.displayBalance(props.delegation.amount, 'SKL')
  const [open, setOpen] = useState(false)

  const delId = Number(props.delegation.stateId)
  const isCompleted = delId === DelegationState.COMPLETED
  const isActive =
    delId === DelegationState.DELEGATED ||
    delId === DelegationState.UNDELEGATION_REQUESTED ||
    delId === DelegationState.PROPOSED ||
    delId === DelegationState.ACCEPTED

  const delegationInfo: types.st.IDelegationInfo = {
    delegationId: props.delegation.id,
    delegationType: props.delegationType
  }

  const loading =
    props.loading &&
    props.loading.delegationType === props.delegationType &&
    'delegationId' in props.loading &&
    props.loading.delegationId === props.delegation.id

  function getStakingText() {
    if (delId === DelegationState.PROPOSED || delId === DelegationState.ACCEPTED) {
      return 'Will be staked'
    } else if (delId === DelegationState.CANCELED || delId === DelegationState.REJECTED) {
      return 'Staking amount'
    } else if (
      delId === DelegationState.DELEGATED ||
      delId === DelegationState.UNDELEGATION_REQUESTED
    ) {
      return 'Staked'
    } else {
      return 'Was staked'
    }
  }

  const noActions =
    Number(props.delegation.stateId) !== DelegationState.PROPOSED &&
    Number(props.delegation.stateId) !== DelegationState.DELEGATED &&
    !isCompleted &&
    !props.isValidatorPage

  if (!props.validator) return null

  return (
    <div className="mb-2.5 bg-background rounded-3xl p-4">
      <div>
        <Grid container spacing={0} alignItems="center">
          <Grid
            size={{ xs: 12, md: 4 }}
            className={`${!noActions ? 'cursor-pointer' : ''}`}
            onClick={() => {
              if (noActions) return
              setOpen(!open)
            }}
          >
            <div className={cls('flex', 'items-center')}>
              <Avatar
                size={50}
                variant="marble"
                name={`delegation-${props.delegation.id}`}
                colors={AVATAR_COLORS}
              />
              {!props.isValidatorPage && (
                <ValidatorLogo
                  validatorId={props.validator.id}
                  size="xxxs"
                  className="creditHistoryIcon"
                />
              )}
              <div className={cls('ml-2.5', ['grow', props.isXs])}>
                <h4 className="font-bold pOneLine text-foreground">
                  ID: {Number(props.delegation.id)}
                </h4>
                <p className={cls('p', 'text-xs', 'text-secondary-foreground')}>
                  {formatBigIntTimestampSeconds(props.delegation.created)}
                </p>
              </div>
            </div>
          </Grid>
          <Grid size={{ xs: 12, md: 8 }} className={cls(['mt-5', props.isXs], 'flex', 'items-center')}>
            <div
              className={cls(
                'chipXs',
                'ml-5',
                'flex',
                'items-center',
                ['bg-green-500/20 text-green-700 border-green-500/30', delId === DelegationState.DELEGATED],
                ['bg-red-500/20 text-red-700 border-red-500/30', delId === DelegationState.REJECTED],
                ['bg-red-500/20 text-red-700 border-red-500/30', delId === DelegationState.CANCELED],
                ['bg-blue-500/20 text-blue-700 border-blue-500/30', delId === DelegationState.COMPLETED],
                ['bg-purple-500/20 text-purple-700 border-purple-500/30', delId === DelegationState.PROPOSED],
                ['bg-yellow-500/20 text-yellow-700 border-yellow-500/30', delId === DelegationState.ACCEPTED],
                ['bg-orange-500/20 text-orange-700 border-orange-500/30', delId === DelegationState.UNDELEGATION_REQUESTED],
                'font-semibold'
              )}
            >
              <p className={cls('p', 'text-xs', 'pOneLine')}>
                {props.delegation.state.replace(/_/g, ' ')}
              </p>
            </div>
            <div
              className={cls(
                'chipXs',
                'ml-2.5',
                'flex',
                'items-center',
                'bg-secondary-foreground/20 text-secondary-foreground border-secondary-foreground/30',
                'font-semibold'
              )}
            >
              <p className={cls('p', 'text-xs', 'pOneLine')}>
                {source}
              </p>
            </div>
            <div className={cls('grow')}></div>
            <SkStack className={cls('flex')}>
              <Tile
                size="md"
                transparent
                className={cls('p-0!', ['mr-10', !props.isXs], ['ml-10', !props.isXs])}
                tooltip={
                  props.sklPrice && props.delegation.amount
                    ? units.displaySklValueUsd(props.delegation.amount, props.sklPrice)
                    : ''
                }
                value={delegationAmount}
                text={getStakingText()}
                grow
                ri={!props.isXs}
                icon={<Coins size={17} />}
              />
            </SkStack>
            {props.delegationType === types.st.DelegationType.ESCROW && (
              <Tooltip title="Escrow delegation">
                <AccountBalanceRoundedIcon className="ml-2.5 text-secondary-foreground" />
              </Tooltip>
            )}
            {!noActions ? (
              open ? (
                <ChevronDown
                  size={17}
                  className={cls(
                    'text-secondary-foreground',
                    'ml-2.5',
                    'cursor-pointer'
                  )}
                  onClick={() => setOpen(!open)}
                />
              ) : (
                <ChevronRight
                  size={17}
                  className={cls(
                    'text-secondary-foreground',
                    'ml-2.5',
                    'cursor-pointer'
                  )}
                  onClick={() => setOpen(!open)}
                />
              )
            ) : null}
          </Grid>
        </Grid>
        <Collapse in={open}>
          <div className="mt-4">
            {props.isValidatorPage && (
              <Tile
                className="p-0 mt-5"
                transparent
                value={props.delegation.address}
                text="Token Holder Address"
                grow
                size="md"
                icon={<AccountCircleRoundedIcon className="text-[17px]!" />}
              />
            )}
            {isCompleted && (
              <Tile
                className="p-0 mt-5"
                transparent
                tooltip={
                  props.sklPrice && props.delegation.finished
                    ? units.displaySklValueUsd(props.delegation.finished, props.sklPrice)
                    : ''
                }
                value={timeUtils.convertMonthIndexToText(Number(props.delegation.finished))}
                text="Delegation completed"
                grow
                size="md"
                icon={<HistoryRoundedIcon className="text-[17px]!" />}
              />
            )}
            {Number(props.delegation.stateId) === DelegationState.PROPOSED && props.accept ? (
              <SkBtn
                loading={loading}
                text={loading ? 'Accepting delegation' : 'Accept delegation'}
                color="primary"
                className="fullW mt-5"
                onClick={async () => {
                  props.accept && (await props.accept(delegationInfo))
                }}
                disabled={props.loading !== false || props.customAddress !== undefined}
              />
            ) : null}
            {Number(props.delegation.stateId) === DelegationState.DELEGATED && props.unstake ? (
              <SkBtn
                loading={loading}
                text={loading ? 'Unstaking tokens' : 'Unstake tokens'}
                color="error"
                className="w-full mt-5"
                onClick={async () => {
                  props.unstake && (await props.unstake(delegationInfo))
                }}
                disabled={props.loading !== false || props.customAddress !== undefined}
              />
            ) : null}
            {Number(props.delegation.stateId) === DelegationState.PROPOSED && props.cancelRequest ? (
              <SkBtn
                loading={loading}
                text={loading ? 'Canceling staking request' : 'Cancel staking request'}
                color="warning"
                className="fullW mt-5"
                onClick={async () => {
                  props.cancelRequest && (await props.cancelRequest(delegationInfo))
                }}
                disabled={props.loading !== false || props.customAddress !== undefined}
              />
            ) : null}
          </div>
        </Collapse>
      </div>
    </div>
  )
}
