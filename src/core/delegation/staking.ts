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
 * @file staking.ts
 * @copyright SKALE Labs 2024-Present
 */

import {
  DelegationType,
  type ISkaleContractsMap,
  type StakingInfo,
  type StakingInfoMap
} from '../interfaces'
import { type interfaces } from '@skalenetwork/metaport'
import { isZeroAddr } from '../helper'
import {
  getDelegationIdsByHolder,
  getDelegations,
  groupDelegationsByValidator,
  sumRewards,
  getDelegatorInfo
} from '.'

export async function getStakingInfoMap(
  sc: ISkaleContractsMap,
  address: interfaces.AddressType | undefined
): Promise<StakingInfoMap> {
  if (!address) return { 0: null, 1: null, 2: null }
  const escrowAddress = await sc.allocator.getEscrowAddress(address)
  const escrowGrantsAddress = await sc.grantsAllocator.getEscrowAddress(address)
  return {
    0: await getStakingInfo(sc, address),
    1: isZeroAddr(escrowAddress)
      ? null
      : await getStakingInfo(sc, escrowAddress, address, DelegationType.ESCROW),
    2: isZeroAddr(escrowGrantsAddress)
      ? null
      : await getStakingInfo(sc, escrowGrantsAddress, address, DelegationType.ESCROW2)
  }
}

export async function getStakingInfo(
  sc: ISkaleContractsMap,
  address: interfaces.AddressType,
  beneficiary?: interfaces.AddressType,
  type?: DelegationType
): Promise<StakingInfo> {
  const delegationIds = await getDelegationIdsByHolder(sc.delegationController, address)
  const delegationsArray = await getDelegations(sc.delegationController, delegationIds)
  const groupedDelegations = await groupDelegationsByValidator(
    delegationsArray,
    sc.distributor,
    address
  )
  const totalRewards = sumRewards(groupedDelegations)
  return {
    info: await getDelegatorInfo(sc, totalRewards, address, beneficiary, type),
    delegations: groupedDelegations
  }
}

export function isDelegationTypeAvailable(si: StakingInfoMap, type: DelegationType): boolean {
  return si[DelegationType.REGULAR] !== null && si[type] !== undefined && si[type] !== null
}

export function isLoaded(si: StakingInfoMap): boolean {
  return si[DelegationType.REGULAR] !== null
}
