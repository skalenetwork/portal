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
 * @file recharge.ts
 * @copyright SKALE Labs 2025-Present
 */

import { Logger, type ILogObj } from 'tslog'
import { ethers } from 'ethers'
import { dc, units, constants, helper } from '@/core'

import { WalletClient } from 'viem'
import { type UseSwitchChainReturnType } from 'wagmi'

import { Action } from './action'
import { sendTransaction } from '../transactions'
import { getCommunityPoolData, waitForActivation } from '../community_pool'
import {
  COMMUNITY_POOL_ESTIMATE_GAS_LIMIT,
  COMMUNITY_POOL_WITHDRAW_GAS_LIMIT,
  DEFAULT_ERROR_MSG
} from '../constants'
import MetaportCore from '../metaport'
import { walletClientToSigner } from '../ethers'
import { enforceNetwork } from '../network'

const log = new Logger<ILogObj>({ name: 'metaport:core:actions:recharge' })

export class RechargeExitGas extends Action {
  async execute() {
    this.updateState('init')

    const cpData = await getCommunityPoolData(
      this.address,
      this.chainName1,
      this.chainName2,
      this.mainnet,
      this.sChain1
    )

    if (cpData.exitGasOk) {
      log.info('Bridge balance already topped up, skipping recharge')
      this.updateState('rechargeDone')
      return
    }

    const mainnet = await this.connectedMainnet(this.mainnet.provider)
    const communityPool = await mainnet.communityPool()
    const sChain = await this.mpc.schain(this.chainName1)
    const communityLocker = await sChain.communityLocker()

    const feeData = await mainnet.provider.getFeeData()
    const chainHash = ethers.id(this.chainName1)
    const rraWei = await communityPool.getRecommendedRechargeAmount(chainHash, this.address, {
      gasPrice: feeData.gasPrice,
      gasLimit: COMMUNITY_POOL_ESTIMATE_GAS_LIMIT
    })

    const rraEther = units.fromWei(rraWei as string, constants.DEFAULT_ERC20_DECIMALS)
    let rechargeAmount = helper.roundUp(parseFloat(rraEther as string) * 1.1)
    if (rechargeAmount < 0.001) {
      rechargeAmount = 0.001
    }

    log.info('Recharge details', {
      chainName: this.chainName1,
      address: this.address,
      gasPrice: feeData.gasPrice?.toString(),
      rraWei: rraWei.toString(),
      rraEther,
      rechargeAmount
    })

    this.updateState('recharge')

    await sendTransaction(
      mainnet.signer,
      communityPool.rechargeUserWallet,
      [
        this.chainName1,
        this.address,
        {
          address: this.address,
          value: units.toWei(String(rechargeAmount), constants.DEFAULT_ERC20_DECIMALS)
        }
      ],
      'mainnet:communityPool:rechargeUserWallet'
    )

    await waitForActivation(communityPool, communityLocker, this.address, chainHash)
    this.updateState('rechargeDone')
  }
}

export async function withdraw(
  mpc: MetaportCore,
  walletClient: WalletClient,
  chainName: string,
  amount: bigint,
  address: `0x${string}`,
  switchChain: UseSwitchChainReturnType['switchChainAsync'],
  setLoading: (loading: string | false) => void,
  setErrorMessage: (errorMessage: dc.ErrorMessage) => void,
  errorMessageClosedFallback: () => void
) {
  setLoading('withdraw')
  try {
    log.info(`Withdrawing from bridge balance: ${chainName}, amount: ${amount}`)
    const { chainId } = await mpc.provider(constants.MAINNET_CHAIN_NAME).provider.getNetwork()
    await enforceNetwork(
      chainId,
      walletClient,
      switchChain,
      mpc.config.skaleNetwork,
      constants.MAINNET_CHAIN_NAME
    )
    const signer = walletClientToSigner(walletClient)
    const connectedMainnet = await mpc.mainnet(signer.provider)
    const communityPool = await connectedMainnet.communityPool()

    await sendTransaction(
      signer,
      communityPool.withdrawFunds,
      [chainName, amount, { address: address, gasLimit: COMMUNITY_POOL_WITHDRAW_GAS_LIMIT }],
      'mainnet:communityPool:withdrawFunds'
    )

    setLoading(false)
  } catch (err) {
    const msg = err.message ? err.message : DEFAULT_ERROR_MSG
    setErrorMessage(new dc.TransactionErrorMessage(msg, errorMessageClosedFallback))
  }
}

export async function recharge(
  mpc: MetaportCore,
  walletClient: WalletClient,
  chainName: string,
  amount: string,
  address: `0x${string}`,
  switchChain: UseSwitchChainReturnType['switchChainAsync'],
  setLoading: (loading: string | false) => void,
  setErrorMessage: (errorMessage: dc.ErrorMessage) => void,
  errorMessageClosedFallback: () => void
) {
  setLoading('recharge')
  try {
    log.info(`Topping up bridge balance: ${chainName}, amount: ${amount}`)

    const sChain = await mpc.schain(chainName)
    const communityLocker = await sChain.communityLocker()

    const { chainId } = await mpc.provider(constants.MAINNET_CHAIN_NAME).provider.getNetwork()
    await enforceNetwork(
      chainId,
      walletClient,
      switchChain,
      mpc.config.skaleNetwork,
      constants.MAINNET_CHAIN_NAME
    )
    const signer = walletClientToSigner(walletClient)
    const connectedMainnet = await mpc.mainnet(signer.provider)
    const communityPool = await connectedMainnet.communityPool()

    await sendTransaction(
      signer,
      communityPool.rechargeUserWallet,
      [
        chainName,
        address,
        { address: address, value: units.toWei(amount, constants.DEFAULT_ERC20_DECIMALS) }
      ],
      'mainnet:communityPool:rechargeUserWallet'
    )

    setLoading('activate')
    const chainHash = ethers.id(chainName)
    await waitForActivation(communityPool, communityLocker, address, chainHash)
  } catch (err) {
    const msg = err.message ? err.message : DEFAULT_ERROR_MSG
    setErrorMessage(new dc.TransactionErrorMessage(msg, errorMessageClosedFallback))
  } finally {
    setLoading(false)
  }
}
