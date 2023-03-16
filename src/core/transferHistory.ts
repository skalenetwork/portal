/**
 * @license
 * SKALE bridge-ui
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

import { METAPORT_CONFIG } from './constants';


const KEY_NAME = `br__transfersHistory_${METAPORT_CONFIG.skaleNetwork}`;


export function getTransferHistory(): Array<any> {
    const br__transfersHistory = localStorage.getItem(KEY_NAME);
    if (!br__transfersHistory) return [];
    return JSON.parse(br__transfersHistory)['data'];
}


export function setTransferHistory(transferHistory: Array<any>): void {
    localStorage.setItem(KEY_NAME, JSON.stringify({ data: transferHistory }));
}


export function addToTransferHistory(transfer: any): void {
    const transferHistory = getTransferHistory();
    transferHistory.push(transfer);
    setTransferHistory(transferHistory);
}


export function clearTransferHistory(): void {
    localStorage.removeItem(KEY_NAME);
}