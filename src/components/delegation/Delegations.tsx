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
 * @file Delegations.tsx
 * @copyright SKALE Labs 2024-Present
 */

import { cmn, cls, styles, interfaces } from '@skalenetwork/metaport'
import Skeleton from '@mui/material/Skeleton'
import AllInboxRoundedIcon from '@mui/icons-material/AllInboxRounded'
import PieChartRoundedIcon from '@mui/icons-material/PieChartRounded'

import Headline from '../Headline'
import DelegationsToValidator from './DelegationsToValidator'

import {
  DelegationType,
  type IDelegationInfo,
  type IDelegationsToValidator,
  type IRewardInfo,
  type IValidator,
  type StakingInfoMap
} from '../../core/interfaces'

export default function Delegations(props: {
  si: StakingInfoMap
  validators: IValidator[]
  retrieveRewards: (rewardInfo: IRewardInfo) => Promise<void>
  loading: IRewardInfo | IDelegationInfo | false
  setErrorMsg: (errorMsg: string | undefined) => void
  errorMsg: string | undefined
  unstake: (delegationInfo: IDelegationInfo) => Promise<void>
  cancelRequest: (delegationInfo: IDelegationInfo) => Promise<void>
  isXs: boolean
  customAddress: interfaces.AddressType | undefined
}) {
  const loaded = props.si[DelegationType.REGULAR] !== null
  const noDelegations =
    (!props.si[DelegationType.REGULAR] ||
      props.si[DelegationType.REGULAR]?.delegations.length === 0) &&
    (!props.si[DelegationType.ESCROW] ||
      props.si[DelegationType.ESCROW]?.delegations.length === 0) &&
    (!props.si[DelegationType.ESCROW2] ||
      props.si[DelegationType.ESCROW2]?.delegations.length === 0)
  return (
    <div>
      <Headline text="Delegations" icon={<AllInboxRoundedIcon />} />
      <div className={cls(cmn.mtop10)} style={{ paddingBottom: '5px' }}></div>
      {!loaded ? (
        <div>
          <Skeleton variant="rectangular" height={86} className={cls(cmn.mbott10)} />
          <div className={cls('nestedSection', ['nestedSectionXs', props.isXs])}>
            <Skeleton variant="rectangular" height={83} className={cls(cmn.mbott10)} />
          </div>
        </div>
      ) : null}
      {loaded && noDelegations ? (
        <div className={cls(cmn.mtop20)}>
          <PieChartRoundedIcon className={cls(cmn.pSec, styles.chainIconlg, cmn.fullWidth)} />
          <h3 className={cls(cmn.p, cmn.p700, cmn.pSec, cmn.pCent, cmn.mtop5, cmn.mbott20)}>
            No tokens staked
          </h3>
        </div>
      ) : (
        <div>
          {props.si[DelegationType.REGULAR]?.delegations.map(
            (delegationsToValidator: IDelegationsToValidator, index: number) => (
              <DelegationsToValidator
                key={index}
                validators={props.validators}
                delegationsToValidator={delegationsToValidator}
                delegationType={DelegationType.REGULAR}
                retrieveRewards={props.retrieveRewards}
                loading={props.loading}
                unstake={props.unstake}
                cancelRequest={props.cancelRequest}
                isXs={props.isXs}
                customAddress={props.customAddress}
              />
            )
          )}
          {props.si[DelegationType.ESCROW]?.delegations.map(
            (delegationsToValidator: IDelegationsToValidator, index: number) => (
              <DelegationsToValidator
                key={index}
                validators={props.validators}
                delegationsToValidator={delegationsToValidator}
                delegationType={DelegationType.ESCROW}
                retrieveRewards={props.retrieveRewards}
                loading={props.loading}
                unstake={props.unstake}
                cancelRequest={props.cancelRequest}
                isXs={props.isXs}
                customAddress={props.customAddress}
              />
            )
          )}
          {props.si[DelegationType.ESCROW2]?.delegations.map(
            (delegationsToValidator: IDelegationsToValidator, index: number) => (
              <DelegationsToValidator
                key={index}
                validators={props.validators}
                delegationsToValidator={delegationsToValidator}
                delegationType={DelegationType.ESCROW2}
                retrieveRewards={props.retrieveRewards}
                loading={props.loading}
                unstake={props.unstake}
                cancelRequest={props.cancelRequest}
                isXs={props.isXs}
                customAddress={props.customAddress}
              />
            )
          )}
        </div>
      )}
    </div>
  )
}
