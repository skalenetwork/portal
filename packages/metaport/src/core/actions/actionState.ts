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
 * @file actionState.ts
 * @copyright SKALE Labs 2023-Present
 */

import { types } from '@/core'

type LoadingButtonTextMap = {
  [key in types.mp.ActionState]: string
}

export const LOADING_BUTTON_TEXT: LoadingButtonTextMap = {
  init: 'Initializing',
  approve: 'Approving transfer',
  approveDone: 'Transfer approved',
  transfer: 'Transferring tokens',
  transferDone: 'Waiting for tokens to be received',
  received: 'Tokens received',
  transferETH: 'Transferring ETH',
  transferETHDone: 'Waiting for ETH to be received',
  receivedETH: 'ETH received',
  approveWrap: 'Approving wrap',
  approveWrapDone: 'Wrap approved',
  wrap: 'Wrapping tokens',
  wrapDone: 'Tokens wrapped',
  unwrap: 'Unwrapping tokens',
  unwrapDone: 'Tokens unwrapped',
  switch: 'Waiting for network switch',
  unlock: 'Unlocking ETH',
  unlockDone: 'ETH unlocked'
}
