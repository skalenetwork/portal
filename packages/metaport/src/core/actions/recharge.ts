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
import { units, constants, helper } from '@/core'

import { Action } from './action'
import { sendTransaction } from '../transactions'
import { getCommunityPoolData } from '../community_pool'
import { BALANCE_UPDATE_INTERVAL_MS, COMMUNITY_POOL_ESTIMATE_GAS_LIMIT } from '../constants'

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

    console.log('[Recharge:execute]', {
      chainName: this.chainName1,
      address: this.address,
      gasPrice: feeData.gasPrice?.toString(),
      rraWei: rraWei.toString(),
      rraEther,
      rechargeAmount,
      rechargeAmountWei: units
        .toWei(String(rechargeAmount), constants.DEFAULT_ERC20_DECIMALS)
        .toString()
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

    let active = false
    let counter = 0
    while (!active) {
      log.info('Waiting for account activation...')
      const activeM = await communityPool.activeUsers(this.address, chainHash)
      const activeS = await communityLocker.activeUsers(this.address)
      active = activeS && activeM
      await helper.sleep(BALANCE_UPDATE_INTERVAL_MS)
      counter++
      if (counter >= 10) break
    }

    this.updateState('rechargeDone')
  }
}
