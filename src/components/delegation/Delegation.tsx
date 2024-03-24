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

import { cmn, cls, TokenIcon, fromWei, styles, SkPaper } from '@skalenetwork/metaport'
import Button from '@mui/material/Button'

import UndoRoundedIcon from '@mui/icons-material/UndoRounded'
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded'
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded'
import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded'
import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded'
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded'
import EventRepeatRoundedIcon from '@mui/icons-material/EventRepeatRounded'

import {
  DelegationType,
  type IDelegation,
  type IDelegationInfo,
  type IRewardInfo,
  type IValidator
} from '../../core/interfaces'
import { DEFAULT_ERC20_DECIMALS } from '../../core/constants'
import ValidatorLogo from './ValidatorLogo'
import { Collapse, Grid, Tooltip } from '@mui/material'
import {
  DelegationSource,
  DelegationState,
  getDelegationSource,
  getKeyByValue,
  getValidatorById
} from '../../core/delegation'
import { formatBigIntTimestampSeconds } from '../../core/timeHelper'
import { useState } from 'react'
import Headline from '../Headline'
import { convertMonthIndexToText, formatBalance } from '../../core/helper'
import SkBtn from '../SkBtn'

export default function Delegation(props: {
  delegation: IDelegation
  validators: IValidator[]
  delegationType: DelegationType
  unstake: (delegationInfo: IDelegationInfo) => Promise<void>
  cancelRequest: (delegationInfo: IDelegationInfo) => Promise<void>
  loading: IRewardInfo | IDelegationInfo | false
}) {
  const validator = getValidatorById(props.validators, props.delegation.validator_id)
  const source = getDelegationSource(props.delegation)
  const delegationAmount = formatBalance(props.delegation.amount, 'SKL')
  const [open, setOpen] = useState(false)

  const isCompleted = Number(props.delegation.stateId) === DelegationState.COMPLETED

  const delegationInfo: IDelegationInfo = {
    delegationId: props.delegation.id,
    delegationType: props.delegationType
  }

  const loading =
    props.loading &&
    props.loading.delegationType === props.delegationType &&
    'delegationId' in props.loading &&
    props.loading.delegationId === props.delegation.id

  if (!validator) return
  return (
    <div className={cls(cmn.mbott10, 'titleSection')}>
      <Grid
        container
        spacing={0}
        alignItems="center"
        className="validatorCard"
        onClick={() => {
          setOpen(!open)
        }}
      >
        <Grid item md={3} xs={4}>
          <div className={cls(cmn.flex, cmn.flexcv)}>
            <ValidatorLogo validatorId={Number(props.delegation.id + 500n)} size="md" />
            <ValidatorLogo
              validatorId={validator.id}
              size="sm"
              className="validatorIconDelegation"
            />
            <div className={cls(cmn.mleft10)}>
              <p className={cls(cmn.p, cmn.p2, cmn.p700)}>ID: {Number(props.delegation.id)}</p>
              <p className={cls(cmn.p, cmn.p4, cmn.pSec)}>
                {formatBigIntTimestampSeconds(props.delegation.created)}
              </p>
            </div>
            {props.delegationType === DelegationType.ESCROW ? (
              <Tooltip title="Escrow delegation">
                <AccountBalanceRoundedIcon className={cls('trustedBadge', cmn.mleft10, cmn.pSec)} />
              </Tooltip>
            ) : null}
            {props.delegationType === DelegationType.ESCROW2 ? (
              <Tooltip title="Grant Escrow delegation">
                <ApartmentRoundedIcon className={cls('trustedBadge', cmn.mleft10, cmn.pSec)} />
              </Tooltip>
            ) : null}
          </div>
        </Grid>
        <Grid item md={3} xs={4}>
          <div className={cls(cmn.flex)}>
            <div className={cls(cmn.flexg)}></div>
            <div className={cls(`ship ship_${props.delegation.state}`)}>
              <p className={cls(cmn.p, cmn.p4, 'pOneLine')}>
                {props.delegation.state.replace(/_/g, ' ')}
              </p>
            </div>
            <div className={cls(cmn.flexg)}></div>
          </div>
        </Grid>
        <Grid item md={2} xs={4}>
          <div className={cls(cmn.flex)}>
            <div className={cls(cmn.flexg)}></div>
            <div className={cls(`ship ship_${getKeyByValue(DelegationSource, source)}`)}>
              <p className={cls(cmn.p, cmn.p4)}>{source}</p>
            </div>
            <div className={cls(cmn.flexg)}></div>
          </div>
        </Grid>
        <Grid item md={4} xs={4}>
          <div className={cls(cmn.flex, cmn.flexcv, cmn.mri5)}>
            <div className={cls(cmn.mleft20, cmn.flexg, cmn.mri20)}>
              <h4 className={cls(cmn.p, cmn.p700, cmn.pri)}>{delegationAmount}</h4>
              <p className={cls(cmn.p, cmn.p4, cmn.pri, cmn.pSec)}>Staked</p>
            </div>
            <ArrowForwardIosRoundedIcon
              className={cls(cmn.pSec, styles.chainIconxs, 'rotate-90', ['active', open])}
            />
          </div>
        </Grid>
      </Grid>
      <Collapse in={open}>
        <div className={cls(cmn.mtop20)}>
          {isCompleted ? (
            <div className={cls(cmn.mbfott20)}>
              <p className={cls(cmn.p, cmn.p3, cmn.pSec)}>Delegation completed</p>
              <p className={cls(cmn.p, cmn.p2, cmn.p700)}>
                {convertMonthIndexToText(Number(props.delegation.finished))}
              </p>
            </div>
          ) : null}
          {Number(props.delegation.stateId) === DelegationState.DELEGATED ? (
            <SkBtn
              loading={loading}
              text={loading ? 'Unstaking tokens' : 'Unstake tokens'}
              color="error"
              className="fullWidth"
              onClick={async () => {
                await props.unstake(delegationInfo)
              }}
              disabled={props.loading !== false}
            />
          ) : null}
          {Number(props.delegation.stateId) === DelegationState.PROPOSED ? (
            <SkBtn
              loading={loading}
              text={loading ? 'Canceling staking request' : 'Cancel staking request'}
              color="warning"
              className="fullWidth"
              onClick={async () => {
                await props.cancelRequest(delegationInfo)
              }}
              disabled={props.loading !== false}
            />
          ) : null}
          {Number(props.delegation.stateId) !== DelegationState.PROPOSED &&
          Number(props.delegation.stateId) !== DelegationState.DELEGATED ? (
            <p className={cls(cmn.p, cmn.p3, cmn.pSec, cmn.pCent, cmn.mtop20)}>
              No actions available
            </p>
          ) : null}
        </div>
      </Collapse>
    </div>
  )
}
