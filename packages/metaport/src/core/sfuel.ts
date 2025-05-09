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
 * @file sfuel.ts
 * @copyright SKALE Labs 2022-Present
 */

import { Logger, type ILogObj } from 'tslog'
import { Provider } from 'ethers'
import { type types, constants } from '@/core'

import MetaportCore from './metaport'
import { isFaucetAvailable, getSFuel } from './faucet'
import { DEFAULT_MIN_SFUEL_WEI } from '../core/constants'

const log = new Logger<ILogObj>({ name: 'metaport:core:sfuel' })

export interface StationData {
  balance: bigint
  ok: boolean
}

export interface StationPowRes {
  message: string
  ok: boolean
}

export class Station {
  endpoint: string
  provider: Provider

  constructor(
    public chainName: string,
    public mpc: MetaportCore
  ) {
    this.chainName = chainName
    this.mpc = mpc
    this.provider = mpc.provider(chainName)
  }

  async getData(address: types.AddressType): Promise<StationData> {
    try {
      const balance = await this.provider.getBalance(address)
      return { balance, ok: balance >= DEFAULT_MIN_SFUEL_WEI }
    } catch (e) {
      log.info(`ERROR: getSFuelData for ${this.chainName} failed!`)
      log.info(e)
      return { balance: undefined, ok: undefined }
    }
  }

  isFaucetAvailable(): boolean {
    return isFaucetAvailable(this.chainName, this.mpc.config.skaleNetwork)
  }

  async doPoW(address: types.AddressType): Promise<StationPowRes> {
    // return { ok: true, message: 'PoW is not available for Ethereum Mainnet' };
    if (!this.chainName || !isFaucetAvailable(this.chainName, this.mpc.config.skaleNetwork)) {
      log.info('WARNING: PoW is not available for this chain')
      if (this.chainName === constants.MAINNET_CHAIN_NAME) {
        return { ok: true, message: 'PoW is not available for Ethereum Mainnet' }
      }
      return { ok: false, message: 'PoW is not available for this chain' }
    }
    log.info('Mining sFUEL for ' + address + ' on ' + this.chainName + '...')
    try {
      await getSFuel(this.chainName, address, this.mpc)
      return { ok: true, message: 'PoW finished successfully' }
    } catch (e) {
      log.info('ERROR: PoW failed!')
      log.info(e)
      return { ok: false, message: e.message }
    }
  }
}
