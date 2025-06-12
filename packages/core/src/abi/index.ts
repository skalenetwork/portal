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
 * @file index.ts
 * @copyright SKALE Labs 2025-Present
 */

import { TokenTypeExtended } from '../dataclasses'

import erc20Abi from './erc20_abi.json'
import erc721Abi from './erc721_abi.json'
import erc721MetaAbi from './erc721meta_abi.json'
import erc1155Abi from './erc1155_abi.json'
import erc20WrapperAbi from './erc20_wrapper_abi.json'

export const ERC_ABIS: { [tokenType in TokenTypeExtended]: { ['abi']: any } } = {
  eth: erc20Abi,
  erc20: erc20Abi,
  erc20wrap: erc20WrapperAbi,
  erc721: erc721Abi,
  erc721meta: erc721MetaAbi,
  erc1155: erc1155Abi
}
