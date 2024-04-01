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
import { ERC_ABIS, type interfaces } from '@skalenetwork/metaport'
import {
  type IDelegationArray,
  type IDelegation,
  type IDelegationsToValidator,
  type ISkaleContractsMap,
  DelegationType,
  type IDelegatorInfo
} from '../interfaces'
import { maxBigInt } from '../helper'

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
  address: interfaces.AddressType
): Promise<bigint[]> {
  const delegationIdsLen = await delegationController.getDelegationsByHolderLength(address)
  return await Promise.all(
    Array.from(
      { length: Number(delegationIdsLen) },
      async (_, id) => await delegationController.delegationsByHolder(address, id)
    )
  )
}

async function getDelegationsRaw(
  delegationController: Contract,
  delegationIds: bigint[]
): Promise<Array<IDelegationArray | bigint>> {
  return await Promise.all(
    delegationIds
      .map((delegationId) => [
        delegationController.getDelegation(delegationId),
        delegationController.getState(delegationId)
      ])
      .flat()
  )
}

export async function getDelegations(
  delegationController: Contract,
  delegationIds: bigint[]
): Promise<IDelegation[]> {
  const rawDelegations: Array<IDelegationArray | bigint> = await getDelegationsRaw(
    delegationController,
    delegationIds
  )
  const delegations: IDelegation[] = []
  for (let i = 0; i < rawDelegations.length; i += 2) {
    const delegationArray: IDelegationArray = rawDelegations[i] as IDelegationArray
    const stateId: bigint = rawDelegations[i + 1] as bigint

    delegations.push({
      id: delegationIds[i / 2],
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
    })
  }
  return delegations
}

export function getDelegationSource(delegation: IDelegation): DelegationSource {
  if (delegation.info.includes('Delegation UI')) return DelegationSource.DELEGATION_UI
  if (delegation.info.includes('MEW Wallet')) return DelegationSource.MEW_WALLET
  if (delegation.info.includes('Activate')) return DelegationSource.ACTIVATE
  if (delegation.info.toLowerCase().includes('portal')) return DelegationSource.PORTAL
  if (delegation.info.includes('Self')) return DelegationSource.SELF
  if (delegation.info.toLowerCase().includes('etherscan')) return DelegationSource.ETHERSCAN
  return DelegationSource.OTHER
}

export function getKeyByValue(enumType: any, enumValue: string): string | undefined {
  // todo: helper
  return Object.keys(enumType).find((key) => enumType[key] === enumValue)
}

export async function groupDelegationsByValidator(
  delegations: IDelegation[],
  distributor: Contract,
  address: interfaces.AddressType
): Promise<IDelegationsToValidator[]> {
  const groupedDelegations = new Map<bigint, IDelegation[]>()
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
      async (delegationsToValidator: IDelegationsToValidator) =>
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

export const sumRewards = (delegations: IDelegationsToValidator[]): bigint =>
  delegations.reduce((total, del) => total + del.rewards, BigInt(0))

export async function initSkaleToken(provider: Provider, instance: any): Promise<Contract> {
  const address = await instance.getContractAddress('SkaleToken')
  return new Contract(address, ERC_ABIS.erc20.abi, provider)
}

export async function getDelegatorInfo(
  sc: ISkaleContractsMap,
  rewards: bigint,
  address: interfaces.AddressType,
  beneficiary?: interfaces.AddressType,
  type?: DelegationType
): Promise<IDelegatorInfo> {
  // type
  const info: IDelegatorInfo = {
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
    if (type === DelegationType.ESCROW) {
      info.vested = await getVestedAmount(sc.allocator, address, beneficiary)
      info.fullAmount = await sc.allocator.getFullAmount(beneficiary)
    }
    if (type === DelegationType.ESCROW2) {
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
  escrowAddress: interfaces.AddressType,
  address: interfaces.AddressType
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

export function getDelegationTypeAlias(type: DelegationType): string {
  if (type === DelegationType.ESCROW) return 'Escrow'
  if (type === DelegationType.ESCROW2) return 'Grant'
  return 'Regular'
}
