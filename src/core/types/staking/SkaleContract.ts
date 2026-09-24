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
 * @file SkaleContract.ts
 * @copyright SKALE Labs 2024-Present
 */

import { type PublicClient } from 'viem'
import { type Instance } from '@skalenetwork/skale-contracts-viem'

export type SkaleContract = Awaited<ReturnType<Instance['getContract']>>

export type SkaleContractName =
  | 'delegationController'
  | 'skaleToken'
  | 'allocator'
  | 'distributor'
  | 'validatorService'
  | 'grantsAllocator'
  | 'tokenState'

export type ISkaleContractsMap = Record<SkaleContractName, SkaleContract> & {
  /** the client every contract in this map is read through */
  client: PublicClient
}

export type ContractType = 'delegation' | 'distributor'
