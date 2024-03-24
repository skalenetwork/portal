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

import { cmn, cls, styles } from '@skalenetwork/metaport'

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
}) {
  const validator = getValidatorById(props.validators, props.delegationsToValidator.validatorId)
  const rewardsAmount = formatBalance(props.delegationsToValidator.rewards, 'SKL')
  if (!validator) return

  const loading =
    props.loading &&
    props.loading.delegationType === props.delType &&
    'validatorId' in props.loading &&
    props.loading.validatorId === validator.id

  return (
    <div className={cls(cmn.mbott10, 'titleSection validatorCard')}>
      <Grid container spacing={0} alignItems="center">
        <Grid item md={4} xs={4}>
          <div className={cls(cmn.flex, cmn.flexcv)}>
            <ValidatorLogo validatorId={validator.id} size="lg" />
            <div className={cls(cmn.mleft10)}>
              <h4 className={cls(cmn.p, cmn.p700, 'pOneLine')}>{validator.name}</h4>
              <p className={cls(cmn.p, cmn.p4, cmn.pSec)}>Validator ID: {Number(validator.id)}</p>
            </div>
          </div>
        </Grid>
        <Grid item md={1} xs={4}></Grid>
        <Grid item md={7} xs={4}>
          <div className={cls(cmn.flex, cmn.flexcv)}>
            <div className={cls(cmn.mleft20, cmn.flexg, cmn.mri20)}>
              <p className={cls(cmn.p, cmn.p4, cmn.pri, cmn.pSec)}>Rewards available</p>
              <h3 className={cls(cmn.p, cmn.p700, cmn.pri)}>{rewardsAmount}</h3>
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
                disabled={props.delegationsToValidator.rewards === 0n || props.loading !== false}
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
            <div
              className={cls(cmn.mleft20, styles.chainIconxs)}
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
          </div>
        </Grid>
      </Grid>
    </div>
  )
}
