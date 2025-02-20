/**
 * @license
 * SKALE Portal
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
 * @file SChain.ts
 * @copyright SKALE Labs 2025-Present
 */

import { Contract } from 'ethers'
import { BaseChain } from './BaseChain'

export default class SChain extends BaseChain {
  async ethBalance(address: string): Promise<bigint> {
    const eth = await this.eth()
    return await eth.balanceOf(address)
  }

  async eth(): Promise<Contract> {
    return this.getContract('TokenManagerETH')
  }

  async erc20(): Promise<Contract> {
    return this.getContract('TokenManagerERC20')
  }

  async erc721(): Promise<Contract> {
    return this.getContract('TokenManagerERC721')
  }

  async erc721meta(): Promise<Contract> {
    return this.getContract('TokenManagerERC721WithMetadata')
  }

  async erc1155(): Promise<Contract> {
    return this.getContract('TokenManagerERC1155')
  }

  async communityLocker(): Promise<Contract> {
    return this.getContract('CommunityLocker')
  }
}
