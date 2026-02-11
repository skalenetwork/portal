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
 * @file baseChain.ts
 * @copyright SKALE Labs 2025-Present
 */

import { Logger, type ILogObj } from 'tslog'
import { type Provider, type Contract, type BigNumberish, type Signer } from 'ethers'
import { Instance } from '@skalenetwork/skale-contracts-ethers-v6'
import { constants, dc, type types, helper } from '@/core'
import { TimeoutException } from '../exceptions'
import { sendTransaction } from '../transactions'

const log = new Logger<ILogObj>({ name: 'metaport:core:contracts:baseChain' })

export type ContractsStringMap = Record<string, Contract>

export type TokenContractsMap = {
  [key in dc.TokenType]: ContractsStringMap
}

export abstract class BaseChain {
  provider: Provider
  instance: Instance
  tokens: TokenContractsMap
  signer: Signer
  _contractsCache: Map<string, Contract>

  constructor(provider: Provider, instance: Instance, signer?: Signer) {
    this.provider = provider
    this.instance = instance
    this.signer = signer
    this._contractsCache = new Map()
    this.tokens = {
      eth: {},
      erc20: {},
      erc721: {},
      erc721meta: {},
      erc1155: {}
    }
  }

  addToken(tokenType: dc.TokenType, keyname: string, contract: Contract): void {
    this.tokens[tokenType][keyname] = contract
  }

  async approve(
    tokenType: dc.TokenType,
    tokenName: string,
    address: types.AddressType,
    amount: BigNumberish
  ): Promise<types.mp.TxResponse> {
    const tokenContract = this.tokens[tokenType][tokenName]
    return await sendTransaction(
      this.signer,
      tokenContract.approve,
      [address, amount],
      'tokenContract.approve'
    )
  }

  async wrap(
    tokenType: dc.TokenType,
    tokenName: string,
    address: types.AddressType,
    amount: BigNumberish
  ): Promise<types.mp.TxResponse> {
    const tokenContract = this.tokens[tokenType][tokenName]
    return await sendTransaction(
      this.signer,
      tokenContract.depositFor,
      [address, amount],
      'tokenContract.depositFor'
    )
  }

  async unwrap(
    tokenType: dc.TokenType,
    tokenName: string,
    address: types.AddressType,
    amount: BigNumberish
  ): Promise<types.mp.TxResponse> {
    const tokenContract = this.tokens[tokenType][tokenName]
    return await sendTransaction(
      this.signer,
      tokenContract.withdrawTo,
      [address, amount],
      'tokenContract.withdrawTo'
    )
  }

  async getContract(name: string): Promise<Contract> {
    let contract = this._contractsCache.get(name)
    if (!contract) {
      contract = (await this.instance.getContract(name)) as Contract
      this._contractsCache.set(name, contract)
    }
    return contract
  }

  clearContractCache(): void {
    this._contractsCache.clear()
  }

  removeFromCache(name: string): void {
    this._contractsCache.delete(name)
  }

  abstract ethBalance(address: string): Promise<bigint>

  async getERC20Balance(tokenContract: Contract, address: string): Promise<bigint> {
    return await tokenContract.balanceOf(address)
  }

  async getERC721OwnerOf(tokenContract: Contract, tokenId: number | string): Promise<string> {
    try {
      if (typeof tokenId === 'string') tokenId = Number(tokenId)
      return await tokenContract.ownerOf(tokenId)
    } catch (err) {
      return constants.ZERO_ADDRESS
    }
  }

  async getERC1155Balance(
    tokenContract: Contract,
    address: string,
    tokenId: number
  ): Promise<bigint> {
    return await tokenContract.balanceOf(address, tokenId)
  }

  async waitETHBalanceChange(
    address: string,
    initial: bigint,
    sleepInterval: number = constants.DEFAULT_SLEEP,
    iterations: number = constants.DEFAULT_ITERATIONS
  ): Promise<void> {
    for (let i = 1; i <= iterations; i++) {
      const res = await this.ethBalance(address)
      if (initial !== res) {
        return
      }
      log.info(
        `🔎 ${i}/${iterations} Waiting for ETH balance change - address: ` +
        `${address}, sleep: ${sleepInterval}ms, initial: ${initial}, current: ${res}`
      )
      await helper.sleep(sleepInterval)
    }
    throw new TimeoutException('waitETHBalanceChange timeout')
  }

  async waitForChange(
    tokenContract: Contract,
    getFunc: any,
    address: string | undefined,
    initial: string | bigint,
    tokenId: number | undefined,
    sleepInterval: number = constants.DEFAULT_SLEEP,
    iterations: number = constants.DEFAULT_ITERATIONS
  ): Promise<void> {
    const logData = 'token: ' + (await tokenContract.getAddress()) + ', address: ' + (address ?? '')
    for (let i = 1; i <= iterations; i++) {
      let res
      if (tokenId === undefined) res = await getFunc(tokenContract, address)
      if (address === undefined) res = await getFunc(tokenContract, tokenId)
      if (tokenId !== undefined && address !== undefined) {
        res = await getFunc(tokenContract, address, tokenId)
      }
      if (initial !== res) {
        return
      }
      log.info(`🔎 ${i}/${iterations} Waiting for change - ${logData}, sleep ${sleepInterval}ms`)
      await helper.sleep(sleepInterval)
    }
    throw new TimeoutException('waitForTokenClone timeout - ' + logData)
  }

  async waitERC20BalanceChange(
    tokenContract: Contract,
    address: string,
    initialBalance: bigint,
    sleepInterval: number = constants.DEFAULT_SLEEP
  ): Promise<void> {
    await this.waitForChange(
      tokenContract,
      this.getERC20Balance.bind(this),
      address,
      initialBalance,
      undefined,
      sleepInterval
    )
  }

  async waitERC721OwnerChange(
    tokenContract: Contract,
    tokenId: number,
    initialOwner: string,
    sleepInterval: number = constants.DEFAULT_SLEEP
  ): Promise<any> {
    await this.waitForChange(
      tokenContract,
      this.getERC721OwnerOf.bind(this),
      undefined,
      initialOwner,
      tokenId,
      sleepInterval
    )
  }

  async waitERC1155BalanceChange(
    tokenContract: Contract,
    address: string,
    tokenId: number,
    initialBalance: bigint,
    sleepInterval: number = constants.DEFAULT_SLEEP
  ): Promise<any> {
    await this.waitForChange(
      tokenContract,
      this.getERC1155Balance.bind(this),
      address,
      initialBalance,
      tokenId,
      sleepInterval
    )
  }
}
