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
 * @file Delegator.ts
 * @copyright SKALE Labs 2024-Present
 */

import { AddressType } from ".."

export interface IDelegatorInfo {
  balance: bigint
  staked: bigint
  rewards: bigint
  forbiddenToDelegate: bigint
  allowedToDelegate?: bigint
  vested?: bigint
  fullAmount?: bigint
  unlocked?: bigint
  address: AddressType
}
