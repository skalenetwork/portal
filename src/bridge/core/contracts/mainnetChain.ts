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
 * @file MainnetChain.ts
 * @copyright SKALE Labs 2025-Present
 */

import { Contract } from 'ethers'
import { constants, helper } from '@/core'
import { BaseChain } from './baseChain'

export default class MainnetChain extends BaseChain {
  async ethBalance(address: string): Promise<bigint> {
    return await this.provider.getBalance(address)
  }

  async lockedETHAmount(address: string): Promise<bigint> {
    const eth = await this.eth()
    return await eth.approveTransfers(address)
  }

  async waitLockedETHAmountChange(
    address: string,
    initial: bigint,
    sleepInterval: number = constants.DEFAULT_SLEEP,
    iterations: number = constants.DEFAULT_ITERATIONS
  ): Promise<void> {
    await helper.pollUntil(
      () => this.lockedETHAmount(address),
      (amount) => amount !== initial,
      sleepInterval * iterations,
      sleepInterval
    )
  }

  async eth(): Promise<Contract> {
    return this.getContract('DepositBoxEth')
  }

  async erc20(): Promise<Contract> {
    return this.getContract('DepositBoxERC20')
  }

  async erc721(): Promise<Contract> {
    return this.getContract('DepositBoxERC721')
  }

  async erc721meta(): Promise<Contract> {
    return this.getContract('DepositBoxERC721WithMetadata')
  }

  async erc1155(): Promise<Contract> {
    return this.getContract('DepositBoxERC1155')
  }

  async linker(): Promise<Contract> {
    return this.getContract('Linker')
  }

  async communityPool(): Promise<Contract> {
    return this.getContract('CommunityPool')
  }

  async communityLocker(): Promise<Contract> {
    return this.getContract('CommunityLocker')
  }
}
