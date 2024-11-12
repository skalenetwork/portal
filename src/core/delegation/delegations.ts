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

import { Contract, type Provider, getUint } from 'ethers'
import { ERC_ABIS } from '@skalenetwork/metaport'
import { types } from '@/core'
import { maxBigInt } from '../helper'
import { BATCH_SIZE } from '../constants'

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
  delegationController: Contract,
  address: types.AddressType
): Promise<bigint[]> {
  const idsLen = await delegationController.getDelegationsByHolderLength(address)
  return await Promise.all(
    Array.from(
      { length: Number(idsLen) },
      async (_, id) => await delegationController.delegationsByHolder(address, id)
    )
  )
}

async function loadDelegationBatch(
  delegationController: Contract,
  valId: number,
  start: number,
  size: number
): Promise<bigint[]> {
  return await Promise.all(
    Array.from(
      { length: size },
      async (_, index) => await delegationController.delegationsByValidator(valId, start + index)
    )
  )
}

export async function getDelegationIdsByValidator(
  delegationController: Contract,
  valId: number
): Promise<bigint[]> {
  const totalDelegations = Number(await delegationController.getDelegationsByValidatorLength(valId))
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
  delegationController: Contract,
  delegationIds: bigint[]
): Promise<types.staking.IDelegation[]> {
  const rawData = await Promise.all(
    delegationIds.flatMap((id) => [
      delegationController.getDelegation(id),
      delegationController.getState(id)
    ])
  )

  return delegationIds.map((id, index) => {
    const delegationArray = rawData[index * 2]
    const stateId = rawData[index * 2 + 1]

    return {
      id,
      address: delegationArray[0],
      validator_id: delegationArray[1],
      amount: delegationArray[2],
      delegation_period: delegationArray[3],
      created: delegationArray[4],
      started: delegationArray[5],
      finished: delegationArray[6],
      info: delegationArray[7],
      stateId,
      state: DelegationState[Number(stateId)]
    }
  })
}

export async function getDelegations(
  delegationController: Contract,
  delegationIds: bigint[]
): Promise<types.staking.IDelegation[]> {
  const batchCount = Math.ceil(delegationIds.length / BATCH_SIZE)
  let allDelegations: types.staking.IDelegation[] = []

  for (let i = 0; i < batchCount; i++) {
    const start = i * BATCH_SIZE
    const batchIds = delegationIds.slice(start, start + BATCH_SIZE)
    const batchDelegations = await loadDelegationDetailsBatch(delegationController, batchIds)
    allDelegations = [...allDelegations, ...batchDelegations]
  }

  return allDelegations
}

export function getDelegationSource(delegation: types.staking.IDelegation): DelegationSource {
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
  delegations: types.staking.IDelegation[],
  distributor: Contract,
  address: types.AddressType
): Promise<types.staking.IDelegationsToValidator[]> {
  const groupedDelegations = new Map<bigint, types.staking.IDelegation[]>()
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
      async (delegationsToValidator: types.staking.IDelegationsToValidator) =>
        await distributor.getAndUpdateEarnedBountyAmountOf.staticCallResult(
          address,
          delegationsToValidator.validatorId
        )
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

export const sumRewards = (delegations: types.staking.IDelegationsToValidator[]): bigint =>
  delegations.reduce((total, del) => total + del.rewards, BigInt(0))

export async function initSkaleToken(provider: Provider, instance: any): Promise<Contract> {
  const address = await instance.getContractAddress('SkaleToken')
  return new Contract(address, ERC_ABIS.erc20.abi, provider)
}

export async function getDelegatorInfo(
  sc: types.staking.ISkaleContractsMap,
  rewards: bigint,
  address: types.AddressType,
  beneficiary?: types.AddressType,
  type?: types.staking.DelegationType
): Promise<types.staking.IDelegatorInfo> {
  const info: types.staking.IDelegatorInfo = {
    balance: await sc.skaleToken.balanceOf(address),
    staked: (
      await sc.delegationController.getAndUpdateDelegatedAmount.staticCallResult(address)
    )[0],
    forbiddenToDelegate: (
      await sc.tokenState.getAndUpdateForbiddenForDelegationAmount.staticCallResult(address)
    )[0],
    rewards,
    address
  }

  info.allowedToDelegate = maxBigInt(info.balance - info.forbiddenToDelegate, 0n)

  if (beneficiary) {
    if (type === types.staking.DelegationType.ESCROW) {
      info.vested = await getVestedAmount(sc.allocator, address, beneficiary)
      info.fullAmount = await sc.allocator.getFullAmount(beneficiary)
    }
    if (type === types.staking.DelegationType.ESCROW2) {
      info.vested = await getVestedAmount(sc.grantsAllocator, address, beneficiary)
      info.fullAmount = await sc.grantsAllocator.getFullAmount(beneficiary)
    }

    const locked = maxBigInt(info.fullAmount! - info.vested!, info.forbiddenToDelegate)
    info.unlocked = maxBigInt(info.balance - locked, 0n)
  }
  return info
}

export async function getVestedAmount(
  allocator: Contract,
  escrowAddress: types.AddressType,
  address: types.AddressType
): Promise<bigint> {
  let vestedAmount: bigint
  if (await allocator.isVestingActive(address)) {
    vestedAmount = await allocator.calculateVestedAmount(address)
  } else {
    const provider = allocator.runner?.provider
    if (provider) {
      const valueHex = await provider.getStorage(escrowAddress, '0x99')
      vestedAmount = getUint(valueHex)
    } else {
      vestedAmount = 0n
    }
  }
  return vestedAmount
}

export function getDelegationTypeAlias(type: types.staking.DelegationType): string {
  if (type === types.staking.DelegationType.ESCROW) return 'Escrow'
  if (type === types.staking.DelegationType.ESCROW2) return 'Grant'
  return 'Regular'
}

export function calculateDelegationTotals(
  delegations: types.staking.IDelegation[]
): types.staking.IDelegationTotals {
  const initialTotals: types.staking.IDelegationTotals = {
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
