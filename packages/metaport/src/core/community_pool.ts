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
 * @file community_pool.ts
 * @copyright SKALE Labs 2023-Present
 */

import { Logger, type ILogObj } from 'tslog'
import { ethers } from 'ethers'
import { dc, type types, units, constants, helper } from '@/core'

import { WalletClient } from 'viem'
import { type UseSwitchChainReturnType } from 'wagmi'

import { walletClientToSigner } from './ethers'
import { enforceNetwork } from './network'
import {
  RECHARGE_MULTIPLIER,
  MINIMUM_RECHARGE_AMOUNT,
  COMMUNITY_POOL_WITHDRAW_GAS_LIMIT,
  COMMUNITY_POOL_ESTIMATE_GAS_LIMIT,
  DEFAULT_ERROR_MSG,
  BALANCE_UPDATE_INTERVAL_MS
} from './constants'
import MetaportCore from './metaport'
import { MainnetChain, SChain } from './contracts'
import { sendTransaction } from './transactions'

const log = new Logger<ILogObj>({ name: 'metaport:core:community_pool' })

export function getEmptyCommunityPoolData(): types.mp.CommunityPoolData {
  return {
    exitGasOk: null,
    isActive: null,
    balance: null,
    accountBalance: null,
    recommendedRechargeAmount: null,
    originalRecommendedRechargeAmount: null
  }
}

export async function getCommunityPoolData(
  address: string,
  chainName1: string,
  chainName2: string,
  mainnet: MainnetChain,
  sChain: SChain
): Promise<types.mp.CommunityPoolData> {
  if (chainName2 !== constants.MAINNET_CHAIN_NAME) {
    return {
      exitGasOk: true,
      isActive: null,
      balance: null,
      accountBalance: null,
      recommendedRechargeAmount: null,
      originalRecommendedRechargeAmount: null
    }
  }
  const communityPool = await mainnet.communityPool()
  const communityLocker = await sChain.communityLocker()

  const balanceWei = await communityPool.getBalance(address, chainName1)
  const accountBalanceWei = await mainnet.ethBalance(address)
  const activeS = await communityLocker.activeUsers(address)
  const chainHash = ethers.id(chainName1)
  const activeM = await communityPool.activeUsers(address, chainHash)

  const feeData = await mainnet.provider.getFeeData()
  const rraWei = await communityPool.getRecommendedRechargeAmount(chainHash, address, {
    gasPrice: feeData.gasPrice,
    gasLimit: COMMUNITY_POOL_ESTIMATE_GAS_LIMIT
  })
  const rraEther = units.fromWei(rraWei as string, constants.DEFAULT_ERC20_DECIMALS)

  let recommendedAmount = helper.roundUp(parseFloat(rraEther as string) * RECHARGE_MULTIPLIER)
  if (recommendedAmount < MINIMUM_RECHARGE_AMOUNT && recommendedAmount !== 0) {
    recommendedAmount = MINIMUM_RECHARGE_AMOUNT
  }

  const communityPoolData = {
    exitGasOk: activeM && activeS && rraWei === 0n,
    isActive: activeM && activeS,
    balance: balanceWei,
    accountBalance: accountBalanceWei,
    recommendedRechargeAmount: recommendedAmount,
    originalRecommendedRechargeAmount: rraWei
  }
  return communityPoolData
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
    log.info(`Withdrawing from community pool: ${chainName}, amount: ${amount}`)
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
      [chainName, amount, { address: address, customGasLimit: COMMUNITY_POOL_WITHDRAW_GAS_LIMIT }],
      'mainnet:communityPool:withdrawFunds'
    )

    setLoading(false)
  } catch (err) {
    console.error(err)
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
    log.info(`Recharging community pool: ${chainName}, amount: ${amount}`)

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

    sendTransaction(
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
    let active = false
    const chainHash = ethers.id(chainName)
    let counter = 0
    while (!active) {
      log.info('Waiting for account activation...')
      let activeM = await communityPool.activeUsers(address, chainHash)
      let activeS = await communityLocker.activeUsers(address)
      active = activeS && activeM
      await helper.sleep(BALANCE_UPDATE_INTERVAL_MS)
      counter++
      if (counter >= 10) break
    }
  } catch (err) {
    console.error(err)
    const msg = err.message ? err.message : DEFAULT_ERROR_MSG
    setErrorMessage(new dc.TransactionErrorMessage(msg, errorMessageClosedFallback))
  } finally {
    setLoading(false)
  }
}
