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

import { Logger, type ILogObj } from 'tslog'
import { types } from '@/core'

const log = new Logger<ILogObj>({ name: 'metaport:core:events' })

function dispatchEvent(name: string, data = {}) {
  log.info(`dispatchEvent - sending: ${name}`)
  window.dispatchEvent(new CustomEvent(name, { detail: data }))
  log.info(`dispatchEvent - sent: ${name}`)
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

  export function actionStateUpdated(actionStateUpdate: types.mp.ActionStateUpdate): void {
    dispatchEvent('metaport_actionStateUpdated', actionStateUpdate)
  }

  export function ethUnlocked(tx: string) {
    dispatchEvent('metaport_ethUnlocked', {
      tx: tx
    })
  }
}

export namespace internalEvents {}
