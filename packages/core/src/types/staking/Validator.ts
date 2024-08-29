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
 * @file Validator.ts
 * @copyright SKALE Labs 2024-Present
 */

import { AddressType } from ".."

export type IValidatorArray = [
  string,
  AddressType,
  AddressType,
  string,
  bigint,
  bigint,
  bigint,
  boolean
]

export interface IValidator {
  name: string
  validatorAddress: AddressType
  requestedAddress: AddressType
  description: string
  feeRate: bigint
  registrationTime: bigint
  minimumDelegationAmount: bigint
  acceptNewRequests: boolean
  trusted: boolean
  id: number
  linkedNodes: number
}
