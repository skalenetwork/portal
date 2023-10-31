/**
 * @license
 * SKALE portal
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
/**
 * @file transferHistory.ts
 * @copyright SKALE Labs 2023-Present
 */

import { type interfaces } from '@skalenetwork/metaport'

function getKeyName(skaleNetwork: interfaces.SkaleNetwork): string {
  return `br__transfersHistory_${skaleNetwork}`
}

export function getHistoryFromStorage(
  skaleNetwork: interfaces.SkaleNetwork
): interfaces.TransferHistory[] {
  const transfersHistory = localStorage.getItem(getKeyName(skaleNetwork))
  if (transfersHistory == null) return []
  return JSON.parse(transfersHistory).data
}

export function setHistoryToStorage(
  transferHistory: interfaces.TransferHistory[],
  skaleNetwork: interfaces.SkaleNetwork
): void {
  localStorage.setItem(getKeyName(skaleNetwork), JSON.stringify({ data: transferHistory }))
}

export function clearTransferHistory(skaleNetwork: interfaces.SkaleNetwork): void {
  localStorage.removeItem(getKeyName(skaleNetwork))
}
