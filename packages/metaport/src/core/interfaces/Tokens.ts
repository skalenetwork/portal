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
 * @file Tokens.ts
 * @copyright SKALE Labs 2022-Present
 */

import { AddressType } from '.'

export interface EthToken {
  chains: ConnectedChainMap
}

export interface Token {
  address?: AddressType
  chains: ConnectedChainMap
}

export interface ConnectedChain {
  hub?: string
  wrapper?: AddressType
  wrapsSFuel?: boolean
  clone?: boolean
}

export interface ConnectedChainMap {
  [chainName: string]: ConnectedChain
}
export interface ChainTokensMap {
  [tokenSymbol: string]: Token
}
// export interface TokenTypeMap { [tokenType: string]: EthToken | ChainTokensMap; }
export interface TokenTypeMap {
  [tokenType: string]: ChainTokensMap
}
export interface TokenConnectionsMap {
  [chainName: string]: TokenTypeMap
}
