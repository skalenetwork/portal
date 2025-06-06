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
 * @file erc20.ts
 * @copyright SKALE Labs 2022-Present
 */

import { Logger, type ILogObj } from 'tslog'
import { Contract } from 'ethers'
import { dc, type types, units } from '@/core'

import { findFirstWrapperChainName } from '../metaport'

import { Action } from '../actions/action'
import { checkERC20Balance, checkERC20Allowance } from './checks'
import { sendTransaction } from '../transactions'

const log = new Logger<ILogObj>({ name: 'metaport:core:actions:erc20' })

export class TransferERC20S2S extends Action {
  async execute() {
    this.updateState('init')
    const erc20S = await this.sChain1.erc20()
    const erc20SAddress = (await erc20S.getAddress()) as types.AddressType
    const checkResAllowance = await checkERC20Allowance(
      this.address,
      erc20SAddress,
      this.amount,
      this.token,
      this.sourceToken
    )
    const sChain = await this.connectedSChain(
      this.sChain1.provider,
      this.token.wrapper(this.chainName2) ? dc.CustomAbiTokenType.erc20wrap : null,
      this.token.wrapper(this.chainName2) ? this.chainName2 : null
    )
    const erc20SConnected = (await sChain.erc20()).connect(this.sChain1.signer) as Contract
    if (!checkResAllowance.res) {
      this.updateState('approve')

      const approveTx = await sChain.approve(
        this.token.type,
        this.token.keyname,
        erc20SAddress,
        this.amount
      )
      const txBlock = await sChain.provider.getBlock(approveTx.response.blockNumber)
      this.updateState('approveDone', approveTx.response.hash, txBlock.timestamp)
      log.info('ApproveERC20S:execute - tx completed: %O', approveTx)
    }

    // main transfer

    this.updateState('transfer')

    const amountWei = units.toWei(this.amount, this.token.meta.decimals)

    let balanceOnDestination

    const tokenConnection = this.token.connections[this.chainName2]

    const isDestinationSFuel = tokenConnection.wrapsSFuel && tokenConnection.clone // TODO!

    if (isDestinationSFuel) {
      balanceOnDestination = await this.sChain2.provider.getBalance(this.address)
    } else {
      balanceOnDestination = await this.sChain2.getERC20Balance(this.destToken, this.address)
    }

    const tx = await sendTransaction(
      sChain.signer,
      erc20SConnected.transferToSchainERC20,
      [this.chainName2, this.originAddress, amountWei, { address: this.address }],
      `${this.chainName1}:erc20:transferToSchainERC20`
    )
    const block = await sChain.provider.getBlock(tx.response.blockNumber)
    this.updateState('transferDone', tx.response.hash, block.timestamp)
    if (isDestinationSFuel) {
      await this.sChain2.waitETHBalanceChange(this.address, balanceOnDestination)
    } else {
      await this.sChain2.waitERC20BalanceChange(this.destToken, this.address, balanceOnDestination)
    }
    this.updateState('received')
  }

  async preAction() {
    const checkResBalance = await checkERC20Balance(
      this.address,
      this.amount,
      this.token,
      this.sourceToken
    )
    if (!checkResBalance.res) {
      this.setAmountErrorMessage(checkResBalance.msg)
      return
    }
    this.setAmountErrorMessage(null)
  }
}

export class WrapERC20S extends Action {
  async execute() {
    this.updateState('init')
    const checkResAllowance = await checkERC20Allowance(
      this.address,
      this.token.connections[this.chainName2].wrapper,
      this.amount,
      this.token,
      this.unwrappedToken
    )
    const sChain = await this.connectedSChain(this.sChain1.provider)
    const wrapperToken = this.mpc.tokenContract(
      this.chainName1,
      this.token.keyname,
      this.token.type,
      sChain.provider,
      dc.CustomAbiTokenType.erc20wrap,
      this.chainName2
    )
    sChain.addToken(this.token.type, `wrap_${this.token.keyname}`, wrapperToken)
    if (!checkResAllowance.res) {
      this.updateState('approveWrap')
      const approveTx = await sChain.approve(
        this.token.type,
        this.token.keyname,
        this.token.wrapper(this.chainName2) as types.AddressType,
        this.amount      )
      const txBlock = await this.sChain1.provider.getBlock(approveTx.response.blockNumber)
      this.updateState('approveWrapDone', approveTx.response.hash, txBlock.timestamp)
    }
    this.updateState('wrap')
    const amountWei = units.toWei(this.amount, this.token.meta.decimals)

    const tx = await sChain.wrap(
      this.token.type,
      `wrap_${this.token.keyname}`,
      this.address,
      amountWei
    )

    const block = await this.sChain1.provider.getBlock(tx.response.blockNumber)
    this.updateState('wrapDone', tx.response.hash, block.timestamp)
  }

  async preAction() {
    const checkResBalance = await checkERC20Balance(
      this.address,
      this.amount,
      this.token,
      this.unwrappedToken
    )
    if (!checkResBalance.res) {
      this.setAmountErrorMessage(checkResBalance.msg)
      return
    }
    this.setAmountErrorMessage(null)
  }
}

export class UnWrapERC20 extends Action {
  async execute() {
    const sChain = await this.connectedSChain(this.sChain1.provider)
    this.updateState('unwrap')
    const tokenContract = this.mpc.tokenContract(
      this.chainName1,
      this.token.keyname,
      this.token.type,
      sChain.provider,
      dc.CustomAbiTokenType.erc20wrap,
      findFirstWrapperChainName(this.token)
    )
    sChain.addToken(this.token.type, this.token.keyname, tokenContract)
    const amountWei = await tokenContract.balanceOf(this.address)
    const tx = await sChain.unwrap(this.token.type, this.token.keyname, this.address, amountWei)
    const block = await sChain.provider.getBlock(tx.response.blockNumber)
    this.updateState('unwrapDone', tx.response.hash, block.timestamp)
  }

  async preAction() { }
}

export class UnWrapERC20S extends Action {
  async execute() {
    const sChain = await this.connectedSChain(
      this.sChain2.provider,
      dc.CustomAbiTokenType.erc20wrap,
      this.chainName1,
      this.chainName2
    )
    this.updateState('unwrap')

    const amountWei = units.toWei(this.amount, this.token.meta.decimals)
    const tx = await sChain.unwrap(this.token.type, this.token.keyname, this.address, amountWei)

    log.info('UnWrapERC20S:execute - tx completed %O', tx)
    const block = await sChain.provider.getBlock(tx.response.blockNumber)
    this.updateState('unwrapDone', tx.response.hash, block.timestamp)
  }

  async preAction() {
    log.info('preAction: UnWrapERC20S')
    const tokenContract = this.sChain1.tokens[this.token.type][this.token.keyname]
    const checkResBalance = await checkERC20Balance(
      this.address,
      this.amount,
      this.token,
      tokenContract
    )
    if (!checkResBalance.res) {
      this.setAmountErrorMessage(checkResBalance.msg)
      return
    }
  }
}

export class TransferERC20M2S extends Action {
  async execute() {
    this.updateState('init')

    const erc20M = await this.mainnet.erc20()
    const erc20MAddress = (await erc20M.getAddress()) as types.AddressType

    // check approve + approve
    const checkResAllowance = await checkERC20Allowance(
      this.address,
      erc20MAddress,
      this.amount,
      this.token,
      this.sourceToken
    )
    const mainnet = await this.connectedMainnet(this.mainnet.provider)
    const erc20MConnected = await mainnet.erc20()
    if (!checkResAllowance.res) {
      this.updateState('approve')

      const approveTx = await mainnet.approve(
        this.token.type,
        this.token.keyname,
        erc20MAddress,
        this.amount
      )

      const txBlock = await mainnet.provider.getBlock(approveTx.response.blockNumber)
      this.updateState('approveDone', approveTx.response.hash, txBlock.timestamp)
    }
    this.updateState('transfer')
    const amountWei = units.toWei(this.amount, this.token.meta.decimals)
    const balanceOnDestination = await this.sChain2.getERC20Balance(this.destToken, this.address)

    const tx = await sendTransaction(
      mainnet.signer,
      erc20MConnected.depositERC20,
      [this.chainName2, this.token.address, amountWei, { address: this.address }],
      `${this.chainName1}:erc20:depositERC20`
    )

    const block = await mainnet.provider.getBlock(tx.response.blockNumber)
    this.updateState('transferDone', tx.response.hash, block.timestamp)
    log.info('TransferERC20M2S:execute - tx completed %O', tx)
    await this.sChain2.waitERC20BalanceChange(this.destToken, this.address, balanceOnDestination)
    this.updateState('received')
    log.info('TransferERC20M2S:execute - tokens received on destination chain')
  }

  async preAction() {
    const checkResBalance = await checkERC20Balance(
      this.address,
      this.amount,
      this.token,
      this.sourceToken
    )
    if (!checkResBalance.res) {
      this.setAmountErrorMessage(checkResBalance.msg)
      return
    }
    this.setAmountErrorMessage(null)
  }
}

export class TransferERC20S2M extends Action {
  async execute() {
    this.updateState('init')
    // check approve + approve

    const erc20S = await this.sChain1.erc20()
    const erc20SAddress = (await erc20S.getAddress()) as types.AddressType

    const checkResAllowance = await checkERC20Allowance(
      this.address,
      erc20SAddress,
      this.amount,
      this.token,
      this.sourceToken
    )
    const sChain = await this.connectedSChain(this.sChain1.provider)
    const erc20SConnected = await sChain.erc20()
    if (!checkResAllowance.res) {
      this.updateState('approve')
      const approveTx = await sChain.approve(
        this.token.type,
        this.token.keyname,
        erc20SAddress,
        this.amount      )
      const txBlock = await sChain.provider.getBlock(approveTx.response.blockNumber)
      this.updateState('approveDone', approveTx.response.hash, txBlock.timestamp)
      log.info('ApproveERC20S:execute - tx completed: %O', approveTx)
    }
    this.updateState('transfer')
    const amountWei = units.toWei(this.amount, this.token.meta.decimals)
    const balanceOnDestination = await this.mainnet.getERC20Balance(this.destToken, this.address)

    const tx = await sendTransaction(
      sChain.signer,
      erc20SConnected.exitToMainERC20,
      [this.originAddress, amountWei, { address: this.address }],
      `${this.chainName1}:erc20:exitToMainERC20`
    )

    const block = await sChain.provider.getBlock(tx.response.blockNumber)
    this.updateState('transferDone', tx.response.hash, block.timestamp)
    log.info('TransferERC20S2M:execute - tx completed %O', tx)
    await this.mainnet.waitERC20BalanceChange(this.destToken, this.address, balanceOnDestination)
    this.updateState('received')
    log.info('TransferERC20S2M:execute - tokens received on destination chain')
  }

  async preAction() {
    const checkResBalance = await checkERC20Balance(
      this.address,
      this.amount,
      this.token,
      this.sourceToken
    )
    if (!checkResBalance.res) {
      this.setAmountErrorMessage(checkResBalance.msg)
      return
    }
    this.setAmountErrorMessage(null)
  }
}
