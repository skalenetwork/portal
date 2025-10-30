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
import { types, units, timeUtils } from '@/core'
import { cmn, cls, styles, Tile } from '@skalenetwork/metaport'

import { Collapse, Grid, Tooltip } from '@mui/material'
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded'
import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded'
import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded'
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded'
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded'

import SkBtn from '../SkBtn'
import ValidatorLogo from './ValidatorLogo'

import {
  DelegationSource,
  DelegationState,
  getDelegationSource,
  getKeyByValue
} from '../../core/delegation'
import { formatBigIntTimestampSeconds } from '../../core/timeHelper'

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

  if (!props.validator) return
  return (
    <div className="cmn.mbott10, 'titleSection'">
      <Grid
        container
        spacing={0}
        alignItems="center"
        className="'fullH', ['pointer', !noActions]"
        onClick={() => {
          if (noActions) return
          setOpen(!open)
        }}
      >
        <Grid size={{ xs: 12, md: 3 }}>
          <div className="cmn.flex, cmn.flexcv">
            <ValidatorLogo validatorId={Number(props.delegation.id + 500n)} size="md" />
            {!props.isValidatorPage && (
              <ValidatorLogo
                validatorId={props.validator.id}
                size="sm"
                className="validatorIconDelegation"
              />
            )}
            <div className="cmn.mleft10">
              <p className=" text-base, cmn.p700">ID: {Number(props.delegation.id)}</p>
              <p className=" text-xs, cmn.pSec">
                {formatBigIntTimestampSeconds(props.delegation.created)}
              </p>
            </div>
            {props.delegationType === types.st.DelegationType.ESCROW ? (
              <Tooltip title="Escrow delegation">
                <AccountBalanceRoundedIcon className="'trustedBadge', cmn.mleft10, cmn.pSec" />
              </Tooltip>
            ) : null}
            {props.delegationType === types.st.DelegationType.ESCROW2 ? (
              <Tooltip title="Grant Escrow delegation">
                <ApartmentRoundedIcon className="'trustedBadge', cmn.mleft10, cmn.pSec" />
              </Tooltip>
            ) : null}
          </div>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <div className="cmn.flex, [cmn.mtop10, props.isXs]">
            <div className="[cmn.flexg, !props.isXs]"></div>
            <div className="`chipXs chip_${props.delegation.state}`">
              <p className=" text-xs, 'pOneLine'">
                {props.delegation.state.replace(/_/g, ' ')}
              </p>
            </div>
            <div className="[cmn.flexg, !props.isXs]"></div>
          </div>
        </Grid>
        <Grid size={{ xs: 6, md: 2 }}>
          <div className="cmn.flex, [cmn.mtop10, props.isXs]">
            <div className="[cmn.flexg, !props.isXs]"></div>
            <div className="`chipXs chip_${getKeyByValue(DelegationSource, source"`)}>
              <p className=" text-xs">{source}</p>
            </div>
            <div className="[cmn.flexg, !props.isXs]"></div>
          </div>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <div className="cmn.flex, cmn.flexcv, cmn.mri5, [cmn.mtop10, props.isXs]">
            <div className="cmn.flexg"></div>
            <div className="cmn.mri20, [cmn.pri, !props.isXs], [cmn.mleft20, !props.isXs]">
              <Tooltip
                arrow
                title={
                  props.sklPrice && props.delegation.amount
                    ? units.displaySklValueUsd(props.delegation.amount, props.sklPrice)
                    : ''
                }
              >
                <h4 className=" cmn.p700, [cmn.pSec, !isActive]">{delegationAmount}</h4>
              </Tooltip>
              <p className=" text-xs, cmn.pSec">{getStakingText()}</p>
            </div>
            <ArrowForwardIosRoundedIcon
              className={cls(
                cmn.pSec,
                styles.chainIconxs,
                'rotate-90',
                ['active', open],
                ['opacity0', noActions]
              )}
            />
          </div>
        </Grid>
      </Grid>
      <Collapse in={open}>
        <div className="cmn.mtop20">
          {props.isValidatorPage && (
            <Tile
              className="cmn.nop, cmn.mtop20"
              transparent
              value={props.delegation.address}
              text="Token Holder Address"
              grow
              size="md"
              icon={<AccountCircleRoundedIcon className="styles.chainIconxs" />}
            />
          )}
          {isCompleted && (
            <Tile
              className="cmn.nop, cmn.mtop20"
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
              icon={<HistoryRoundedIcon className="styles.chainIconxs" />}
            />
          )}
          {Number(props.delegation.stateId) === DelegationState.PROPOSED && props.accept ? (
            <SkBtn
              loading={loading}
              text={loading ? 'Accepting delegation' : 'Accept delegation'}
              color="primary"
              className="'fullW', cmn.mtop20"
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
              className="'fullW'"
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
              className="fullW"
              onClick={async () => {
                props.cancelRequest && (await props.cancelRequest(delegationInfo))
              }}
              disabled={props.loading !== false || props.customAddress !== undefined}
            />
          ) : null}
        </div>
      </Collapse>
    </div>
  )
}
