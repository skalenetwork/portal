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

import debug from 'debug'
import { ethers } from 'ethers'
import { MainnetChain, SChain } from '@skalenetwork/ima-js'
import { dc, types } from '@/core'

import { WalletClient } from 'viem'
import { type UseSwitchChainReturnType } from 'wagmi'

import { fromWei, toWei } from './convertation'
import { walletClientToSigner } from './ethers'
import { enforceNetwork, getMainnetAbi } from './network'
import {
  MAINNET_CHAIN_NAME,
  DEFAULT_ERC20_DECIMALS,
  RECHARGE_MULTIPLIER,
  MINIMUM_RECHARGE_AMOUNT,
  COMMUNITY_POOL_WITHDRAW_GAS_LIMIT,
  COMMUNITY_POOL_ESTIMATE_GAS_LIMIT,
  DEFAULT_ERROR_MSG,
  BALANCE_UPDATE_INTERVAL_MS
} from './constants'
import { delay, roundUp } from './helper'
import MetaportCore from './metaport'


debug.enable('*')
const log = debug('metaport:core:community_pool')

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
  if (chainName2 !== MAINNET_CHAIN_NAME) {
    return {
      exitGasOk: true,
      isActive: null,
      balance: null,
      accountBalance: null,
      recommendedRechargeAmount: null,
      originalRecommendedRechargeAmount: null
    }
  }
  const balanceWei = await mainnet.communityPool.balance(address, chainName1)
  const accountBalanceWei = await mainnet.ethBalance(address)
  const activeS = await sChain.communityLocker.contract.activeUsers(address)
  const chainHash = ethers.id(chainName1)
  const activeM = await mainnet.communityPool.contract.activeUsers(address, chainHash)

  const feeData = await mainnet.communityPool.contract.runner.provider.getFeeData()
  const rraWei = await mainnet.communityPool.contract.getRecommendedRechargeAmount(
    chainHash,
    address,
    {
      gasPrice: feeData.gasPrice,
      gasLimit: COMMUNITY_POOL_ESTIMATE_GAS_LIMIT
    }
  )
  const rraEther = fromWei(rraWei as string, DEFAULT_ERC20_DECIMALS)

  let recommendedAmount = roundUp(parseFloat(rraEther as string) * RECHARGE_MULTIPLIER)
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
    log(`Withdrawing from community pool: ${chainName}, amount: ${amount}`)
    const { chainId } = await mpc.mainnet().provider.getNetwork()
    await enforceNetwork(
      chainId,
      walletClient,
      switchChain,
      mpc.config.skaleNetwork,
      MAINNET_CHAIN_NAME
    )
    const signer = walletClientToSigner(walletClient)
    const connectedMainnet = new MainnetChain(
      signer.provider,
      getMainnetAbi(mpc.config.skaleNetwork)
    )
    await connectedMainnet.communityPool.withdraw(chainName, amount, {
      address: address,
      customGasLimit: COMMUNITY_POOL_WITHDRAW_GAS_LIMIT
    })
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
    log(`Recharging community pool: ${chainName}, amount: ${amount}`)

    const sChain = mpc.schain(chainName)
    const { chainId } = await mpc.mainnet().provider.getNetwork()
    await enforceNetwork(
      chainId,
      walletClient,
      switchChain,
      mpc.config.skaleNetwork,
      MAINNET_CHAIN_NAME
    )
    const signer = walletClientToSigner(walletClient)
    const connectedMainnet = new MainnetChain(
      signer.provider,
      getMainnetAbi(mpc.config.skaleNetwork)
    )
    await connectedMainnet.communityPool.recharge(chainName, address, {
      address: address,
      value: toWei(amount, DEFAULT_ERC20_DECIMALS)
    })
    setLoading('activate')
    let active = false
    const chainHash = ethers.id(chainName)
    let counter = 0
    while (!active) {
      log('Waiting for account activation...')
      let activeM = await connectedMainnet.communityPool.contract.activeUsers(address, chainHash)
      let activeS = await sChain.communityLocker.contract.activeUsers(address)
      active = activeS && activeM
      await delay(BALANCE_UPDATE_INTERVAL_MS)
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
