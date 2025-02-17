/**
 * @license
 * SKALE Metaport
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * @file ActionStateUpdate.ts
 * @copyright SKALE Labs 2023-Present
 */

import { ActionState } from './ActionState'

export interface ActionStateUpdate {
  actionName: string
  actionState: ActionState
  actionData: {
    chainName1: string
    chainName2: string
    address: string
    amount: string
    amountWei: bigint
    tokenId: number
  }
  transactionHash?: string
  timestamp?: number
}
