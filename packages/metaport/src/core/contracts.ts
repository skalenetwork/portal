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
 * @file contracts.ts
 * @copyright SKALE Labs 2023-Present
 */

import { CustomAbiTokenType, TokenType } from './dataclasses'

import erc20Abi from '../metadata/erc20_abi.json'
import erc721Abi from '../metadata/erc721_abi.json'
import erc721MetaAbi from '../metadata/erc721meta_abi.json'
import erc1155Abi from '../metadata/erc1155_abi.json'
import erc20WrapperAbi from '../metadata/erc20_wrapper_abi.json'
import sFuelWrapperAbi from '../metadata/sfuel_wrapper_abi.json'

import mainnetAddresses from '../metadata/addresses/mainnet.json'
import legacyAddresses from '../metadata/addresses/legacy.json'
import regressionAddresses from '../metadata/addresses/regression.json'
import testnetAddresses from '../metadata/addresses/testnet.json'

import sChainAbi from '../metadata/schainAbi.json'
import mainnetAbi from '../metadata/mainnetAbi.json'

export const ERC_ABIS: { [tokenType in CustomAbiTokenType | TokenType]: { ['abi']: any } } = {
  eth: erc20Abi,
  erc20: erc20Abi,
  erc20wrap: erc20WrapperAbi,
  sfuelwrap: sFuelWrapperAbi,
  erc721: erc721Abi,
  erc721meta: erc721MetaAbi,
  erc1155: erc1155Abi
}

export const IMA_ADDRESSES = {
  mainnet: mainnetAddresses,
  legacy: legacyAddresses,
  regression: regressionAddresses,
  testnet: testnetAddresses
}

export const IMA_ABIS = {
  mainnet: mainnetAbi,
  schain: sChainAbi
}
