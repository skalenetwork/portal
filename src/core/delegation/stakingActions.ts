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
 * @file stakingActions.tsx
 * @copyright SKALE Labs 2024-Present
 */

import { type Signer } from 'ethers'
import { sendTransaction } from '@skalenetwork/metaport'
import { type types } from '@/core'

import { initActionContract } from '../contracts'

export type LoadingState = types.st.IRewardInfo | types.st.IDelegationInfo | false
export type SetLoadingFn = (state: LoadingState) => void
export type SetErrorFn = (msg: string | undefined) => void
export type PostActionFn = () => Promise<void>

export interface StakingActionProps {
  sc: types.st.ISkaleContractsMap | null
  address: types.AddressType | undefined
  skaleNetwork: types.SkaleNetwork
  getMainnetSigner: () => Promise<Signer>
  setLoading: SetLoadingFn
  setErrorMsg: SetErrorFn
  postAction: PostActionFn
}

async function processTx({
  delegationType,
  txName,
  txArgs,
  contractType,
  props
}: {
  delegationType: types.st.DelegationType
  txName: string
  txArgs: any[]
  contractType: types.st.ContractType
  props: StakingActionProps
}) {
  if (!props.sc || !props.address) return

  try {
    const signer = await props.getMainnetSigner()
    const contract = await initActionContract(
      signer,
      delegationType,
      props.address,
      props.skaleNetwork,
      contractType
    )

    const res = await sendTransaction(contract[txName], txArgs)
    if (!res.status) {
      props.setErrorMsg(res.err?.name)
    } else {
      props.setErrorMsg(undefined)
      await props.postAction()
    }
  } catch (err: any) {
    console.error(err)
    props.setErrorMsg(err.message || 'Transaction failed')
  } finally {
    props.setLoading(false)
  }
}

export async function retrieveRewards({
  rewardInfo,
  rewardAddress,
  props
}: {
  rewardInfo: types.st.IRewardInfo
  rewardAddress: types.AddressType
  props: StakingActionProps
}) {
  props.setLoading(rewardInfo)

  await processTx({
    delegationType: rewardInfo.delegationType,
    txName: 'withdrawBounty',
    txArgs: [rewardInfo.validatorId, rewardAddress],
    contractType: 'distributor',
    props
  })
}

export async function unstakeDelegation({
  delegationInfo,
  props
}: {
  delegationInfo: types.st.IDelegationInfo
  props: StakingActionProps
}) {
  props.setLoading(delegationInfo)

  await processTx({
    delegationType: delegationInfo.delegationType,
    txName: 'requestUndelegation',
    txArgs: [delegationInfo.delegationId],
    contractType: 'delegation',
    props
  })
}

export async function cancelDelegationRequest({
  delegationInfo,
  props
}: {
  delegationInfo: types.st.IDelegationInfo
  props: StakingActionProps
}) {
  props.setLoading(delegationInfo)

  await processTx({
    delegationType: delegationInfo.delegationType,
    txName: 'cancelPendingDelegation',
    txArgs: [delegationInfo.delegationId],
    contractType: 'delegation',
    props
  })
}

export async function retrieveUnlockedTokens({
  rewardInfo,
  props
}: {
  rewardInfo: types.st.IRewardInfo
  props: StakingActionProps
}) {
  props.setLoading(rewardInfo)

  await processTx({
    delegationType: rewardInfo.delegationType,
    txName: 'retrieve',
    txArgs: [],
    contractType: 'distributor',
    props
  })
}

export async function acceptDelegation({
  delegationInfo,
  props
}: {
  delegationInfo: types.st.IDelegationInfo
  props: StakingActionProps
}) {
  props.setLoading(delegationInfo)

  await processTx({
    delegationType: delegationInfo.delegationType,
    txName: 'acceptPendingDelegation',
    txArgs: [delegationInfo.delegationId],
    contractType: 'delegation',
    props
  })
}
