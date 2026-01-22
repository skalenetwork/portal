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
 * @file eth.ts
 * @copyright SKALE Labs 2022-Present
 */

import { Logger, type ILogObj } from 'tslog'
import { units, helper } from '@/core'

import { Action } from './action'
import { checkEthBalance } from './checks'
import { sendTransaction } from '../transactions'

const log = new Logger<ILogObj>({ name: 'metaport:core:actions:eth' })

export class TransferEthM2S extends Action {
  async execute() {
    this.updateState('init')
    const amountWei = units.toWei(this.amount, this.token.meta.decimals)
    const sChainBalanceBefore = await this.sChain2.ethBalance(this.address)
    const mainnet = await this.connectedMainnet(this.mainnet.provider)
    const ethM = await mainnet.eth()
    this.updateState('transferETH')

    const tx = await sendTransaction(
      mainnet.signer,
      ethM.deposit,
      [this.chainName2, { address: this.address, value: amountWei }],
      'mainnet:eth:deposit'
    )

    const block = await helper.getBlockWithRetry(this.mainnet.provider, tx.response.blockNumber)
    this.updateState('transferETHDone', tx.response.hash, block.timestamp)
    await this.sChain2.waitETHBalanceChange(this.address, sChainBalanceBefore)
    this.updateState('receivedETH')
  }

  async preAction() {
    const checkResBalance = await checkEthBalance(
      this.mainnet,
      this.address,
      this.amount,
      this.token,
      this.mpc.config.skaleNetwork
    )
    if (!checkResBalance.res) {
      this.setAmountErrorMessage(checkResBalance.msg)
      return
    }
    this.setAmountErrorMessage(null)
  }
}

export class TransferEthS2M extends Action {
  async execute() {
    log.info('TransferEthS2M: started')
    this.updateState('init')
    const amountWei = units.toWei(this.amount, this.token.meta.decimals)
    const sChain = await this.connectedSChain(this.sChain1.provider)

    const ethS = await sChain.eth()
    const lockedETHAmount = await this.mainnet.lockedETHAmount(this.address)

    this.updateState('transferETH')

    const tx = await sendTransaction(
      sChain.signer,
      ethS.exitToMain,
      [amountWei, { address: this.address }],
      'mainnet:eth:exitToMain'
    )

    const block = await helper.getBlockWithRetry(this.sChain1.provider, tx.response.blockNumber)
    this.updateState('transferETHDone', tx.response.hash, block.timestamp)
    await this.mainnet.waitLockedETHAmountChange(this.address, lockedETHAmount)
    this.updateState('receivedETH')
  }

  async preAction() {
    const checkResBalance = await checkEthBalance(
      this.sChain1,
      this.address,
      this.amount,
      this.token,
      this.mpc.config.skaleNetwork
    )
    if (!checkResBalance.res) {
      this.setAmountErrorMessage(checkResBalance.msg)
      return
    }
    this.setAmountErrorMessage(null)
  }
}

export class UnlockEthM extends Action {
  static label = 'Unlock ETH'
  static buttonText = 'Unlock'
  static loadingText = 'Unlocking'

  async execute() {
    this.updateState('init')
    const mainnet = await this.connectedMainnet(
      this.mainnet.provider,
      undefined,
      undefined,
      this.chainName2
    )
    const ethM = await mainnet.eth()
    this.updateState('unlock')

    const tx = await sendTransaction(
      mainnet.signer,
      ethM.getMyEth,
      [{ address: this.address }],
      'mainnet:eth:getMyEth'
    )
    const block = await helper.getBlockWithRetry(this.mainnet.provider, tx.response.blockNumber)
    this.updateState('unlockDone', tx.response.hash, block.timestamp)
  }
}
