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
 * @file index.ts
 * @copyright SKALE Labs 2022-Present
 */

import { Logger, type ILogObj } from 'tslog'
import { dc, helper } from '@/core'

import { TransferEthM2S, TransferEthS2M, UnlockEthM } from './eth'
import {
  TransferERC20S2S,
  WrapERC20S,
  UnWrapERC20S,
  UnWrapERC20,
  TransferERC20M2S,
  TransferERC20S2M
} from './erc20'

import { ActionConstructor } from './action'
import { S2S_POSTFIX, M2S_POSTFIX, S2M_POSTFIX } from '../constants'

const log = new Logger<ILogObj>({ name: 'metaport:core:actions' })

export function getActionName(
  chainName1: string,
  chainName2: string,
  tokenType: dc.TokenType
): string {
  if (!chainName1 || !chainName2 || !tokenType) return
  log.info(`Getting action name: ${chainName1} ${chainName2} ${tokenType}`)
  let postfix = S2S_POSTFIX
  if (helper.isMainnet(chainName1)) {
    postfix = M2S_POSTFIX
  }
  if (helper.isMainnet(chainName2)) {
    postfix = S2M_POSTFIX
  }
  const actionName = tokenType + '_' + postfix
  log.info('Action name: ' + actionName)
  return actionName
}

export const ACTIONS: { [actionType in dc.ActionType]: ActionConstructor } = {
  eth_m2s: TransferEthM2S,
  eth_s2m: TransferEthS2M,
  eth_s2s: TransferERC20S2S,
  eth_unlock: UnlockEthM,

  wrap: WrapERC20S,
  unwrap: UnWrapERC20S,
  unwrap_stuck: UnWrapERC20,

  erc20_m2s: TransferERC20M2S,
  erc20_s2m: TransferERC20S2M,
  erc20_s2s: TransferERC20S2S
}
