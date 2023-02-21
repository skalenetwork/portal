/**
 * @license
 * SKALE Bridge UI
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
 * @file convertation.ts
 * @copyright SKALE Labs 2023-Present
 */

import { ZERO_ADDRESS, ZERO_FUNCSIG, FAUCET_DATA } from './constants';
import Web3 from 'web3';


function getAddress(chainName: string) {
    if (!isFaucetAvailable(chainName)) return ZERO_ADDRESS;
    const faucet: { [x: string]: { [x: string]: string } } = FAUCET_DATA;
    return faucet[chainName].address;
}

function getFunc(chainName: string) {
    if (!isFaucetAvailable(chainName)) return ZERO_FUNCSIG;
    const faucet: { [x: string]: { [x: string]: string } } = FAUCET_DATA;
    return faucet[chainName].func;
}

export function isFaucetAvailable(chainName: string) {
    if (!FAUCET_DATA) return false;
    let keys = Object.keys(FAUCET_DATA);
    return keys.includes(chainName);
}

export function getFuncData(web3: Web3, chainName: string, address: string) {
    const faucetAddress = getAddress(chainName);
    const functionSig = getFunc(chainName);
    const functionParam = web3.eth.abi.encodeParameter('address', address);
    return { to: faucetAddress, data: functionSig + functionParam.slice(2) };
}