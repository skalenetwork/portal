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
 * @file TokenData.ts
 * @copyright SKALE Labs 2022-Present
 */

import { DEFAULT_ERC20_DECIMALS } from '../constants'
import { TokenMetadata, ConnectedChainMap } from '../types/metaport'
import { AddressType } from '../types'
import { TokenType } from './TokenType'

export class TokenData {
  address: AddressType
  keyname: string
  type: TokenType
  meta: TokenMetadata
  connections: ConnectedChainMap
  chain: string

  constructor(
    address: AddressType,
    type: TokenType,
    tokenKeyname: string,
    metadata: TokenMetadata,
    connections: ConnectedChainMap,
    chain: string
  ) {
    this.address = address
    this.meta = metadata
    this.meta.decimals = this.meta.decimals ? this.meta.decimals : DEFAULT_ERC20_DECIMALS
    this.connections = connections
    this.type = type
    this.keyname = tokenKeyname
    this.chain = chain
  }

  wrapper(destChain: string): string | undefined {
    return this.connections[destChain].wrapper
  }

  isClone(destChain: string): boolean | undefined {
    return this.connections[destChain].clone
  }

  wrapsSFuel(destChain: string): boolean | undefined {
    return this.connections[destChain].wrapsSFuel
  }
}
