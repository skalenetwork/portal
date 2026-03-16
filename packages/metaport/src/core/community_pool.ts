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
import { ethers, type Contract } from 'ethers'
import { type types, units, constants, helper } from '@/core'

import {
  RECHARGE_MULTIPLIER,
  MINIMUM_RECHARGE_AMOUNT,
  COMMUNITY_POOL_ESTIMATE_GAS_LIMIT,
  BALANCE_UPDATE_INTERVAL_MS,
  MAX_ACTIVATION_RETRIES
} from './constants'
import { MainnetChain, SChain } from './contracts'

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

  const isActive = activeM && activeS
  let recommendedAmount = helper.roundUp(parseFloat(rraEther as string) * RECHARGE_MULTIPLIER)
  if (!isActive && recommendedAmount < MINIMUM_RECHARGE_AMOUNT) {
    recommendedAmount = MINIMUM_RECHARGE_AMOUNT
  }

  log.info('Bridge balance estimation', {
    chainName1,
    address,
    gasPrice: feeData.gasPrice?.toString(),
    rraWei: rraWei.toString(),
    rraEther,
    multiplier: RECHARGE_MULTIPLIER,
    recommendedAmount,
    balanceWei: balanceWei.toString(),
    accountBalanceWei: accountBalanceWei.toString(),
    activeM,
    activeS,
    exitGasOk: isActive && rraWei === 0n
  })

  return {
    exitGasOk: isActive && rraWei === 0n,
    isActive,
    balance: balanceWei,
    accountBalance: accountBalanceWei,
    recommendedRechargeAmount: recommendedAmount,
    originalRecommendedRechargeAmount: rraWei
  }
}

export async function waitForActivation(
  communityPool: Contract,
  communityLocker: Contract,
  address: string,
  chainHash: string
): Promise<void> {
  for (let i = 0; i < MAX_ACTIVATION_RETRIES; i++) {
    log.info('Waiting for account activation...')
    const activeM = await communityPool.activeUsers(address, chainHash)
    const activeS = await communityLocker.activeUsers(address)
    if (activeS && activeM) return
    await helper.sleep(BALANCE_UPDATE_INTERVAL_MS)
  }
  throw new Error('Account activation timed out. Please try again.')
}
