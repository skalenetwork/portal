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
 * @file TokenDataMap.ts
 * @copyright SKALE Labs 2022-Present
 */

import { TokenData } from '../../core/dataclasses/TokenData'
import { TokenType } from '../../core/dataclasses/TokenType'
import { Contract } from 'ethers'

export interface TokenDataMap {
  [tokenSymbol: string]: TokenData
}

export type TokenDataTypesMap = {
  [TokenType.eth]: TokenDataMap
  [TokenType.erc20]: TokenDataMap
  [TokenType.erc721]: TokenDataMap
  [TokenType.erc721meta]: TokenDataMap
  [TokenType.erc1155]: TokenDataMap
}

export interface TokenContractsMap {
  [tokenKeyname: string]: Contract
}
export interface TokenBalancesMap {
  [tokenKeyname: string]: bigint
}
