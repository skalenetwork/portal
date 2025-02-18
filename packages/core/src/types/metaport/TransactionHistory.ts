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
 * @file TransactionHistory.ts
 * @copyright SKALE Labs 2023-Present
 */

import { AddressType } from '..'

export interface TransactionHistory {
  transactionHash: string
  timestamp: number
  chainName: string
  txName: string
}

export interface TransferHistory {
  transactions: TransactionHistory[]
  tokenKeyname: string
  address: AddressType | undefined
  chainName1: string
  chainName2: string
  amount: string
}
