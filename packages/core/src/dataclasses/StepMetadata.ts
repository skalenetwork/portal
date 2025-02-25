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
 * @file StepMetadata.ts
 * @copyright SKALE Labs 2022-Present
 */

import { TokenType } from './TokenType'
import { isMainnet } from '../helper'
import { S2S_POSTFIX, M2S_POSTFIX, S2M_POSTFIX } from '../constants'

export enum ActionType {
  erc20_m2s = 'erc20_m2s',
  erc20_s2m = 'erc20_s2m',
  erc20_s2s = 'erc20_s2s',
  wrap = 'wrap',
  unwrap = 'unwrap',
  unwrap_stuck = 'unwrap_stuck',
  eth_m2s = 'eth_m2s',
  eth_s2m = 'eth_s2m',
  eth_s2s = 'eth_s2s',
  eth_unlock = 'eth_unlock'
}

export function getActionType(
  chainName1: string,
  chainName2: string,
  tokenType: TokenType
): ActionType | undefined {
  if (!chainName1 || !chainName2 || !tokenType) return
  let postfix = S2S_POSTFIX
  if (isMainnet(chainName1)) {
    postfix = M2S_POSTFIX
  }
  if (isMainnet(chainName2)) {
    postfix = S2M_POSTFIX
  }
  const actionName = tokenType + '_' + postfix
  return actionName as ActionType
}

export abstract class StepMetadata {
  headline: string = ''
  text: string = ''
  btnText: string = ''
  btnLoadingText: string = ''

  onSource: boolean = true

  constructor(
    public type: ActionType,
    public from: string,
    public to: string
  ) {}
}

export class TransferStepMetadata extends StepMetadata {
  headline: string = 'Transfer to'
  text: string = 'You may need to approve first.'
  btnText: string = 'Transfer'
  btnLoadingText: string = 'Transferring'

  onSource: boolean = false
}

export class WrapStepMetadata extends StepMetadata {
  headline: string = 'Wrap on'
  text: string = 'Tokens should be wrapped before transferring. Approval may be required.'
  btnText: string = 'Wrap'
  btnLoadingText: string = 'Wrapping'

  constructor(
    public from: string,
    public to: string
  ) {
    super(ActionType.wrap, from, to)
  }
}

export class UnwrapStepMetadata extends StepMetadata {
  headline: string = 'Unwrap on'
  text: string = 'Tokens should be unwrapped after transferring.'
  btnText: string = 'Unwrap'
  btnLoadingText: string = 'Unwrapping'
  onSource: boolean = false

  constructor(
    public from: string,
    public to: string
  ) {
    super(ActionType.unwrap, from, to)
  }
}

export class UnlockStepMetadata extends StepMetadata {
  headline: string = 'Unlock on'
  text: string = 'ETH should be unlocked on Ethereum.'
  btnText: string = 'Unlock'
  btnLoadingText: string = 'Unlocking'
  onSource: boolean = false

  constructor(
    public from: string,
    public to: string
  ) {
    super(ActionType.eth_unlock, from, to)
  }
}
