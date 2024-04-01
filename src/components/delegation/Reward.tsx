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

import { cmn, cls, styles, interfaces } from '@skalenetwork/metaport'

import { Grid } from '@mui/material'
import Button from '@mui/material/Button'
import LoadingButton from '@mui/lab/LoadingButton'

import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded'
import RemoveCircleRoundedIcon from '@mui/icons-material/RemoveCircleRounded'

import ValidatorLogo from './ValidatorLogo'

import {
  type DelegationType,
  type IDelegationInfo,
  type IDelegationsToValidator,
  type IRewardInfo,
  type IValidator
} from '../../core/interfaces'
import { getValidatorById } from '../../core/delegation'
import { formatBalance } from '../../core/helper'

export default function Reward(props: {
  validators: IValidator[]
  delegationsToValidator: IDelegationsToValidator
  setOpen: (open: boolean) => void
  open: boolean
  retrieveRewards: (rewardInfo: IRewardInfo) => Promise<void>
  loading: IRewardInfo | IDelegationInfo | false
  delType: DelegationType
  isXs: boolean
  customAddress: interfaces.AddressType | undefined
}) {
  const validator = getValidatorById(props.validators, props.delegationsToValidator.validatorId)
  const rewardsAmount = formatBalance(props.delegationsToValidator.rewards, 'SKL')
  const totalStakedAmount = formatBalance(props.delegationsToValidator.staked, 'SKL')
  if (!validator) return

  const loading =
    props.loading &&
    props.loading.delegationType === props.delType &&
    'validatorId' in props.loading &&
    props.loading.validatorId === validator.id

  const minimizeBtn = (
    <div
      className={cls(cmn.mleft20, styles.chainIconxs, 'pointer')}
      onClick={() => {
        props.setOpen(!props.open)
      }}
    >
      {props.open ? (
        <RemoveCircleRoundedIcon className={cls(cmn.mri5, styles.chainIconxs, cmn.pSec)} />
      ) : (
        <AddCircleRoundedIcon className={cls(cmn.mri5, styles.chainIconxs, cmn.pSec)} />
      )}
    </div>
  )

  return (
    <div className={cls(cmn.mbott10, 'titleSection')}>
      <Grid container spacing={0} alignItems="center">
        <Grid item md={4} xs={12}>
          <div className={cls(cmn.flex, cmn.flexcv)}>
            <ValidatorLogo validatorId={validator.id} size="lg" />
            <div className={cls(cmn.mleft10, [cmn.flexg, props.isXs])}>
              <h4 className={cls(cmn.p, cmn.p700, 'pOneLine')}>{validator.name}</h4>
              <p className={cls(cmn.p, cmn.p4, cmn.pSec)}>Validator ID: {Number(validator.id)}</p>
            </div>
            {props.isXs ? minimizeBtn : null}
          </div>
        </Grid>
        <Grid item md={8} xs={12} className={cls([cmn.mtop20, props.isXs])}>
          <div className={cls(cmn.flex, cmn.flexcv)}>
            <div className={cls([cmn.flexg, !props.isXs])}></div>
            {!props.isXs && !props.open ? (
              <div className={cls([cmn.pri, !props.isXs], cmn.flex)}>
                <div>
                  <p className={cls(cmn.p, cmn.p4, cmn.pSec)}>Total staked</p>
                  <h3 className={cls(cmn.p, cmn.p700)}>{totalStakedAmount}</h3>
                </div>
                <div className={cls('borderVert', cmn.mleft20)}></div>
              </div>
            ) : null}
            <div
              className={cls(
                [cmn.flexg, props.isXs],
                cmn.mri20,
                [cmn.pri, !props.isXs],
                [cmn.mleft20, !props.isXs]
              )}
            >
              <p className={cls(cmn.p, cmn.p4, cmn.pSec)}>Rewards available</p>
              <h3 className={cls(cmn.p, cmn.p700)}>{rewardsAmount}</h3>
            </div>
            {loading ? (
              <LoadingButton
                loading
                loadingPosition="start"
                size="small"
                variant="contained"
                className={cls('btnSm btnSmLoading')}
              >
                Retrieving
              </LoadingButton>
            ) : (
              <Button
                variant="contained"
                className={cls('btnSm')}
                disabled={
                  props.delegationsToValidator.rewards === 0n ||
                  props.loading !== false ||
                  props.customAddress !== undefined
                }
                onClick={() => {
                  props.retrieveRewards({
                    validatorId: validator.id,
                    delegationType: props.delType
                  })
                }}
              >
                Retrieve
              </Button>
            )}
            {!props.isXs ? minimizeBtn : null}
          </div>
        </Grid>
      </Grid>
    </div>
  )
}
