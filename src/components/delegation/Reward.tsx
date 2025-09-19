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
import { types, units } from '@/core'

import { Grid } from '@mui/material'
import Button from '@mui/material/Button'
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded'
import RemoveCircleRoundedIcon from '@mui/icons-material/RemoveCircleRounded'

import ValidatorLogo from './ValidatorLogo'

import { getValidatorById } from '../../core/delegation'
import RetrieveRewardModal from './RetrieveRewardModal'

export default function Reward(props: {
  validators: types.st.IValidator[]
  delegationsToValidator: types.st.IDelegationsToValidator
  setOpen: (open: boolean) => void
  open: boolean
  retrieveRewards: (rewardInfo: types.st.IRewardInfo) => Promise<void>
  loading: types.st.IRewardInfo | types.st.IDelegationInfo | false
  delegationType: types.st.DelegationType
  isXs: boolean
  address: types.AddressType | undefined
  customAddress: types.AddressType | undefined
  customRewardAddress: types.AddressType | undefined
  setCustomRewardAddress: (customRewardAddress: types.AddressType | undefined) => void
  unstakeAllBtn?: React.ReactNode
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
      <div className={cls(cmn.mbott10, 'titleSection')}>
        <Grid container spacing={0} alignItems="center">
          <Grid size={{ xs: 12, md: 4 }}>
            <div className={cls(cmn.flex, cmn.flexcv)}>
              <ValidatorLogo validatorId={validator.id} size="lg" />
              <div className={cls(cmn.mleft10, [cmn.flexg, props.isXs])}>
                <h4 className={cls(cmn.p, cmn.p700, 'pOneLine')}>{validator.name}</h4>
                <p className={cls(cmn.p, cmn.p4, cmn.pSec)}>Validator ID: {Number(validator.id)}</p>
              </div>
              {props.isXs ? minimizeBtn : null}
            </div>
          </Grid>
          <Grid size={{ xs: 12, md: 8 }} className={cls([cmn.mtop20, props.isXs])}>
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
              <div className={cls(cmn.flex, cmn.flexcv)}>
                {loading ? (
                  <Button disabled size="small" variant="contained" className={cls('btnSm btnSmLoading')}>
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
                    {props.unstakeAllBtn && (
                      <span className={cmn.mleft10}>{props.unstakeAllBtn}</span>
                    )}
                  </>
                )}
              </div>
              {!props.isXs ? minimizeBtn : null}
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  )
}
