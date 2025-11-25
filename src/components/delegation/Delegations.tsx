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

import Skeleton from '@mui/material/Skeleton'
import AllInboxRoundedIcon from '@mui/icons-material/AllInboxRounded'
import PieChartRoundedIcon from '@mui/icons-material/PieChartRounded'

import Headline from '../Headline'
import DelegationsToValidator from './DelegationsToValidator'
import { types } from '@/core'

export default function Delegations(props: {
  si: types.st.StakingInfoMap
  validators: types.st.IValidator[]
  retrieveRewards: (rewardInfo: types.st.IRewardInfo) => Promise<void>
  loading: types.st.IRewardInfo | types.st.IDelegationInfo | false
  setErrorMsg: (errorMsg: string | undefined) => void
  errorMsg: string | undefined
  unstake: (delegationInfo: types.st.IDelegationInfo) => Promise<void>
  cancelRequest: (delegationInfo: types.st.IDelegationInfo) => Promise<void>
  isXs: boolean
  address: types.AddressType | undefined
  customAddress: types.AddressType | undefined
  customRewardAddress: types.AddressType | undefined
  setCustomRewardAddress: (customRewardAddress: types.AddressType | undefined) => void
  sklPrice: bigint
}) {
  const loaded = props.si[types.st.DelegationType.REGULAR] !== null
  const noDelegations =
    (!props.si[types.st.DelegationType.REGULAR] ||
      props.si[types.st.DelegationType.REGULAR]?.delegations.length === 0) &&
    (!props.si[types.st.DelegationType.ESCROW] ||
      props.si[types.st.DelegationType.ESCROW]?.delegations.length === 0) &&
    (!props.si[types.st.DelegationType.ESCROW2] ||
      props.si[types.st.DelegationType.ESCROW2]?.delegations.length === 0)
  return (
    <div>
      <Headline
        size="small"
        text="Delegations"
        icon={<AllInboxRoundedIcon className="text-[17px]!" />}
      />
      <div className="mt-2.5" style={{ paddingBottom: '5px' }}></div>
      {!loaded ? (
        <div>
          <Skeleton variant="rectangular" height={86} className="mb-2.5" />
          <div className="'nestedSection', ['nestedSectionXs', props.isXs]">
            <Skeleton variant="rectangular" height={83} className="mb-2.5" />
          </div>
        </div>
      ) : null}
      {loaded && noDelegations ? (
        <div className="mt-5">
          <PieChartRoundedIcon className="text-secondary-foreground styles.chainIconlg w-full" />
          <h3 className="font-bold text-secondary-foreground text-center mt-1.5 mb-5">
            No tokens staked
          </h3>
        </div>
      ) : (
        <div>
          {props.si[types.st.DelegationType.REGULAR]?.delegations.map(
            (delegationsToValidator: types.st.IDelegationsToValidator, index: number) => (
              <DelegationsToValidator
                key={index}
                validators={props.validators}
                delegationsToValidator={delegationsToValidator}
                delegationType={types.st.DelegationType.REGULAR}
                retrieveRewards={props.retrieveRewards}
                loading={props.loading}
                unstake={props.unstake}
                cancelRequest={props.cancelRequest}
                isXs={props.isXs}
                address={props.address}
                customAddress={props.customAddress}
                customRewardAddress={props.customRewardAddress}
                setCustomRewardAddress={props.setCustomRewardAddress}
                sklPrice={props.sklPrice}
              />
            )
          )}
          {props.si[types.st.DelegationType.ESCROW]?.delegations.map(
            (delegationsToValidator: types.st.IDelegationsToValidator, index: number) => (
              <DelegationsToValidator
                key={index}
                validators={props.validators}
                delegationsToValidator={delegationsToValidator}
                delegationType={types.st.DelegationType.ESCROW}
                retrieveRewards={props.retrieveRewards}
                loading={props.loading}
                unstake={props.unstake}
                cancelRequest={props.cancelRequest}
                isXs={props.isXs}
                address={props.address}
                customAddress={props.customAddress}
                customRewardAddress={props.customRewardAddress}
                setCustomRewardAddress={props.setCustomRewardAddress}
                sklPrice={props.sklPrice}
              />
            )
          )}
          {props.si[types.st.DelegationType.ESCROW2]?.delegations.map(
            (delegationsToValidator: types.st.IDelegationsToValidator, index: number) => (
              <DelegationsToValidator
                key={index}
                validators={props.validators}
                delegationsToValidator={delegationsToValidator}
                delegationType={types.st.DelegationType.ESCROW2}
                retrieveRewards={props.retrieveRewards}
                loading={props.loading}
                unstake={props.unstake}
                cancelRequest={props.cancelRequest}
                isXs={props.isXs}
                address={props.address}
                customAddress={props.customAddress}
                customRewardAddress={props.customRewardAddress}
                setCustomRewardAddress={props.setCustomRewardAddress}
                sklPrice={props.sklPrice}
              />
            )
          )}
        </div>
      )}
    </div>
  )
}
