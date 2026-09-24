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
 * @file delegations.ts
 * @copyright SKALE Labs 2024-Present
 */

import { hexToBigInt, type PublicClient } from 'viem'

import { helper, types } from '@/core'
import { BATCH_SIZE } from '../constants'

/** getDelegation returns a single all-named tuple, so viem decodes it to an object. */
interface RawDelegation {
  holder: types.AddressType
  validatorId: bigint
  amount: bigint
  delegationPeriod: bigint
  created: bigint
  started: bigint
  finished: bigint
  info: string
}


export enum DelegationState {
  PROPOSED = 0,
  ACCEPTED = 1,
  CANCELED = 2,
  REJECTED = 3,
  DELEGATED = 4,
  UNDELEGATION_REQUESTED = 5,
  COMPLETED = 6
}

export enum DelegationSource {
  DELEGATION_UI = 'Delegation UI',
  MEW_WALLET = 'MEW Wallet',
  ACTIVATE = 'Activate',
  PORTAL = 'Portal',
  SELF = 'Self-delegation',
  ETHERSCAN = 'Etherscan',
  OTHER = 'Other'
}

export async function getDelegationIdsByHolder(
  delegationController: types.st.SkaleContract,
  address: types.AddressType
): Promise<bigint[]> {
  const idsLen = await delegationController.read.getDelegationsByHolderLength([address])
  return await Promise.all(
    Array.from(
      { length: Number(idsLen) },
      async (_, id) =>
        (await delegationController.read.delegationsByHolder([address, BigInt(id)])) as bigint
    )
  )
}

async function loadDelegationBatch(
  delegationController: types.st.SkaleContract,
  valId: number,
  start: number,
  size: number
): Promise<bigint[]> {
  return await Promise.all(
    Array.from(
      { length: size },
      async (_, index) =>
        (await delegationController.read.delegationsByValidator([
          BigInt(valId),
          BigInt(start + index)
        ])) as bigint
    )
  )
}

export async function getDelegationIdsByValidator(
  delegationController: types.st.SkaleContract,
  valId: number
): Promise<bigint[]> {
  const totalDelegations = Number(
    await delegationController.read.getDelegationsByValidatorLength([BigInt(valId)])
  )
  const batchCount = Math.ceil(totalDelegations / BATCH_SIZE)
  let allDelegations: bigint[] = []

  for (let i = 0; i < batchCount; i++) {
    const start = i * BATCH_SIZE
    const batchSize = Math.min(BATCH_SIZE, totalDelegations - start)
    const batch = await loadDelegationBatch(delegationController, valId, start, batchSize)
    allDelegations = [...allDelegations, ...batch]
  }

  return allDelegations
}

async function loadDelegationDetailsBatch(
  delegationController: types.st.SkaleContract,
  delegationIds: bigint[]
): Promise<types.st.IDelegation[]> {
  const rawData = await Promise.all(
    delegationIds.flatMap((id) => [
      delegationController.read.getDelegation([id]),
      delegationController.read.getState([id])
    ])
  )

  return delegationIds.map((id, index) => {
    const delegation = rawData[index * 2] as RawDelegation
    const stateId = rawData[index * 2 + 1] as bigint

    return {
      id,
      address: delegation.holder,
      validator_id: delegation.validatorId,
      amount: delegation.amount,
      delegation_period: delegation.delegationPeriod,
      created: delegation.created,
      started: delegation.started,
      finished: delegation.finished,
      info: delegation.info,
      stateId,
      state: DelegationState[Number(stateId)]
    }
  })
}

export async function getDelegations(
  delegationController: types.st.SkaleContract,
  delegationIds: bigint[]
): Promise<types.st.IDelegation[]> {
  const batchCount = Math.ceil(delegationIds.length / BATCH_SIZE)
  let allDelegations: types.st.IDelegation[] = []

  for (let i = 0; i < batchCount; i++) {
    const start = i * BATCH_SIZE
    const batchIds = delegationIds.slice(start, start + BATCH_SIZE)
    const batchDelegations = await loadDelegationDetailsBatch(delegationController, batchIds)
    allDelegations = [...allDelegations, ...batchDelegations]
  }

  return allDelegations
}

export function getDelegationSource(delegation: types.st.IDelegation): DelegationSource {
  if (delegation.info.includes('Delegation UI')) return DelegationSource.DELEGATION_UI
  if (delegation.info.includes('MEW Wallet')) return DelegationSource.MEW_WALLET
  if (delegation.info.includes('Activate')) return DelegationSource.ACTIVATE
  if (delegation.info.toLowerCase().includes('portal')) return DelegationSource.PORTAL
  if (delegation.info.includes('Self')) return DelegationSource.SELF
  if (delegation.info.toLowerCase().includes('etherscan')) return DelegationSource.ETHERSCAN
  return DelegationSource.OTHER
}

export function getKeyByValue(enumType: any, enumValue: string): string | undefined {
  return Object.keys(enumType).find((key) => enumType[key] === enumValue)
}

export async function groupDelegationsByValidator(
  delegations: types.st.IDelegation[],
  distributor: types.st.SkaleContract,
  address: types.AddressType
): Promise<types.st.IDelegationsToValidator[]> {
  const groupedDelegations = new Map<bigint, types.st.IDelegation[]>()
  delegations.forEach((delegation) => {
    const { validator_id } = delegation
    const existingDelegations = groupedDelegations.get(validator_id) || []
    groupedDelegations.set(validator_id, [...existingDelegations, delegation])
  })

  const delegationsArray = Array.from(groupedDelegations.entries()).map(
    ([validatorId, delegations]) => ({
      validatorId,
      delegations,
      rewards: 0n,
      staked: 0n
    })
  )

  const res = await Promise.all(
    delegationsArray.map(
      async (delegationsToValidator: types.st.IDelegationsToValidator) =>
        (await distributor.read.getAndUpdateEarnedBountyAmountOf([
          address,
          BigInt(delegationsToValidator.validatorId)
        ])) as [bigint, bigint]
    )
  )
  delegationsArray.forEach((delegationsToValidator, index) => {
    delegationsToValidator.rewards = res[index][0]
    delegationsToValidator.staked = delegationsToValidator.delegations.reduce(
      (total, delegation) => {
        if (Number(delegation.stateId) === DelegationState.DELEGATED) {
          return total + delegation.amount
        } else {
          return total
        }
      },
      0n
    )
  })

  return delegationsArray
}

export const sumRewards = (delegations: types.st.IDelegationsToValidator[]): bigint =>
  delegations.reduce((total, del) => total + del.rewards, BigInt(0))

export async function getDelegatorInfo(
  sc: types.st.ISkaleContractsMap,
  rewards: bigint,
  address: types.AddressType,
  beneficiary?: types.AddressType,
  type?: types.st.DelegationType
): Promise<types.st.IDelegatorInfo> {
  const info: types.st.IDelegatorInfo = {
    balance: (await sc.skaleToken.read.balanceOf([address])) as bigint,
    staked: (await sc.delegationController.read.getAndUpdateDelegatedAmount([address])) as bigint,
    forbiddenToDelegate: (await sc.tokenState.read.getAndUpdateForbiddenForDelegationAmount([
      address
    ])) as bigint,
    rewards,
    address
  }

  info.allowedToDelegate = helper.maxBigInt(info.balance - info.forbiddenToDelegate, 0n)

  if (beneficiary) {
    if (type === types.st.DelegationType.ESCROW) {
      info.vested = await getVestedAmount(sc.client, sc.allocator, address, beneficiary)
      info.fullAmount = (await sc.allocator.read.getFullAmount([beneficiary])) as bigint
    }
    if (type === types.st.DelegationType.ESCROW2) {
      info.vested = await getVestedAmount(sc.client, sc.grantsAllocator, address, beneficiary)
      info.fullAmount = (await sc.grantsAllocator.read.getFullAmount([beneficiary])) as bigint
    }

    const locked = helper.maxBigInt(info.fullAmount! - info.vested!, info.forbiddenToDelegate)
    info.unlocked = helper.maxBigInt(info.balance - locked, 0n)
  }
  return info
}

export async function getVestedAmount(
  client: PublicClient,
  allocator: types.st.SkaleContract,
  escrowAddress: types.AddressType,
  address: types.AddressType
): Promise<bigint> {
  if (await allocator.read.isVestingActive([address])) {
    return (await allocator.read.calculateVestedAmount([address])) as bigint
  }
  const value = await client.getStorageAt({ address: escrowAddress, slot: '0x99' })
  return value ? hexToBigInt(value) : 0n
}

export function getDelegationTypeAlias(type: types.st.DelegationType): string {
  if (type === types.st.DelegationType.ESCROW) return 'Escrow'
  if (type === types.st.DelegationType.ESCROW2) return 'Grant'
  return 'Regular'
}

export function calculateDelegationTotals(
  delegations: types.st.IDelegation[]
): types.st.IDelegationTotals {
  const initialTotals: types.st.IDelegationTotals = {
    proposed: { count: 0, amount: 0n },
    accepted: { count: 0, amount: 0n },
    delegated: { count: 0, amount: 0n },
    completed: { count: 0, amount: 0n }
  }

  return delegations.reduce((totals, delegation) => {
    const amount = delegation.amount

    switch (Number(delegation.stateId)) {
      case DelegationState.PROPOSED:
        totals.proposed.count++
        totals.proposed.amount += amount
        break
      case DelegationState.ACCEPTED:
        totals.accepted.count++
        totals.accepted.amount += amount
        break
      case DelegationState.DELEGATED:
        totals.delegated.count++
        totals.delegated.amount += amount
        break
      case DelegationState.COMPLETED:
        totals.completed.count++
        totals.completed.amount += amount
        break
    }

    return totals
  }, initialTotals)
}

export function getProposedDelegationsCount(
  validatorDelegations: types.st.IDelegation[] | null
): number | null {
  if (!validatorDelegations) return null

  return validatorDelegations.filter(
    (delegation) => Number(delegation.stateId) === DelegationState.PROPOSED
  ).length
}
