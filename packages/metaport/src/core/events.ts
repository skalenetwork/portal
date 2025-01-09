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
 * @file events.ts
 * @copyright SKALE Labs 2022-Present
 */

import debug from 'debug'
import * as interfaces from './interfaces/index'

debug.enable('*')
const log = debug('metaport:core:events')

function dispatchEvent(name: string, data = {}) {
  log(`dispatchEvent - sending: ${name}`)
  window.dispatchEvent(new CustomEvent(name, { detail: data }))
  log(`dispatchEvent - sent: ${name}`)
}

export namespace externalEvents {
  export function balance(tokenSymbol: string, schainName: string, _balance: string) {
    dispatchEvent('metaport_balance', {
      tokenSymbol: tokenSymbol,
      schainName: schainName,
      balance: _balance
    })
  }

  export function transferComplete(
    tx: string,
    chainName1: string,
    chainName2: string,
    tokenSymbol: string,
    unwrap: boolean = false
  ) {
    dispatchEvent('metaport_transferComplete', {
      tokenSymbol: tokenSymbol,
      from: chainName1,
      to: chainName2,
      tx: tx,
      unwrap: unwrap
    })
  }

  export function transferRequestCompleted(transferRequest: interfaces.TransferParams) {
    dispatchEvent('metaport_transferRequestCompleted', { transferRequest: transferRequest })
  }

  export function actionStateUpdated(actionStateUpdate: interfaces.ActionStateUpdate): void {
    dispatchEvent('metaport_actionStateUpdated', actionStateUpdate)
  }

  export function unwrapComplete(tx: string, chainName1: string, tokenSymbol: string) {
    dispatchEvent('metaport_unwrapComplete', {
      tokenSymbol: tokenSymbol,
      chain: chainName1,
      tx: tx
    })
  }

  export function ethUnlocked(tx: string) {
    dispatchEvent('metaport_ethUnlocked', {
      tx: tx
    })
  }

  export function connected() {
    dispatchEvent('metaport_connected')
  }
}

export namespace internalEvents {}
