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

import debug from 'debug'
import { MainnetChain, SChain } from '@skalenetwork/ima-js'

import { toWei } from '../convertation'
import { Action } from './action'
import { checkEthBalance } from './checks'

debug.enable('*')
const log = debug('metaport:actions:eth')

export class TransferEthM2S extends Action {
  async execute() {
    this.updateState('init')
    const amountWei = toWei(this.amount, this.token.meta.decimals)
    const sChainBalanceBefore = await this.sChain2.ethBalance(this.address)
    const mainnet = (await this.getConnectedChain(this.mainnet.provider)) as MainnetChain
    this.updateState('transferETH')
    const tx = await mainnet.eth.deposit(this.chainName2, {
      address: this.address,
      value: amountWei
    })
    const block = await this.mainnet.provider.getBlock(tx.blockNumber)
    this.updateState('transferETHDone', tx.hash, block.timestamp)
    await this.sChain2.waitETHBalanceChange(this.address, sChainBalanceBefore)
    this.updateState('receivedETH')
  }

  async preAction() {
    const checkResBalance = await checkEthBalance(
      this.mainnet,
      this.address,
      this.amount,
      this.token
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
    log('TransferEthS2M: started')
    this.updateState('init')
    const amountWei = toWei(this.amount, this.token.meta.decimals)
    const lockedETHAmount = await this.mainnet.eth.lockedETHAmount(this.address)
    const sChain = (await this.getConnectedChain(this.sChain1.provider)) as SChain
    this.updateState('transferETH')
    const tx = await sChain.eth.withdraw(amountWei, { address: this.address })
    const block = await this.sChain1.provider.getBlock(tx.blockNumber)
    this.updateState('transferETHDone', tx.hash, block.timestamp)
    await this.mainnet.eth.waitLockedETHAmountChange(this.address, lockedETHAmount)
    this.updateState('receivedETH')
  }

  async preAction() {
    const checkResBalance = await checkEthBalance(
      this.sChain1,
      this.address,
      this.amount,
      this.token
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
    const mainnet = (await this.getConnectedChain(
      this.mainnet.provider,
      undefined,
      undefined,
      this.chainName2
    )) as MainnetChain
    this.updateState('unlock')
    const tx = await mainnet.eth.getMyEth({ address: this.address })
    const block = await this.mainnet.provider.getBlock(tx.blockNumber)
    this.updateState('unlockDone', tx.hash, block.timestamp)
  }
}
