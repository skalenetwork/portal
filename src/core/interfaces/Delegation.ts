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
 * @file Delegation.ts
 * @copyright SKALE Labs 2023-Present
 */

import { type interfaces } from '@skalenetwork/metaport'

export type IDelegationArray = [
  interfaces.AddressType,
  bigint,
  bigint,
  bigint,
  bigint,
  bigint,
  bigint,
  string
]

export interface IDelegation {
  id: bigint
  address: interfaces.AddressType
  validator_id: bigint
  amount: bigint
  delegation_period: bigint
  created: bigint
  started: bigint
  finished: bigint
  info: string
  stateId: bigint
  state: string
}

export interface IDelegationsToValidator {
  validatorId: bigint
  delegations: IDelegation[]
  rewards: bigint
  staked: bigint
}

export enum DelegationType {
  REGULAR = 0,
  ESCROW = 1,
  ESCROW2 = 2
}

export interface IRewardInfo {
  validatorId: number
  delegationType: DelegationType
}

export interface IDelegationInfo {
  delegationId: bigint
  delegationType: DelegationType
}
