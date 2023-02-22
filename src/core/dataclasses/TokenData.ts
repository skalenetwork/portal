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
 * @file TokenData.ts
 * @copyright SKALE Labs 2023-Present
 */

import { DEFAULT_ERC20_DECIMALS } from '../constants';
import { TokenType } from './TokenType';


export default class TokenData {
    originAddress: string
    cloneAddress: string

    name: string
    symbol: string
    keyname: string

    clone: boolean
    type: TokenType

    balance: string | null

    iconUrl: string
    decimals: string

    constructor(
        cloneAddress: string,
        originAddress: string,
        name: string,
        symbol: string,
        clone: boolean,
        iconUrl: string,
        type: TokenType,
        decimals: string
    ) {
        this.cloneAddress = cloneAddress;
        this.originAddress = originAddress;
        this.name = name;
        this.symbol = symbol;
        this.clone = clone;
        this.iconUrl = iconUrl;
        this.decimals = decimals ? decimals : DEFAULT_ERC20_DECIMALS;
        this.type = type;
        this.balance = null;
        this.keyname = getTokenKeyname(symbol, originAddress);
    }
}


export function getTokenKeyname(symbol: string, originAddress: string): string {
    return `_${symbol}_${originAddress}`;
}
