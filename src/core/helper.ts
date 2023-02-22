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
 * @file helper.js
 * @copyright SKALE Labs 2021-Present
*/


import { MAINNET_CHAIN_NAME, CHAIN_ICONS } from './constants';


export function rmPad0x(s: string) {
    let fx = remove0x(s);
    fx = fx.replace(/^0+/, '');
    return add0x(fx);
}

export function add0x(s: string) {
    if (!s.startsWith('0x')) {
        return '0x' + s
    }
    return s;
}

export function remove0x(s: string) {
    if (!s.startsWith('0x')) return s;
    return s.slice(2);
}

function hashCode(str: string) {
    let hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
}

export function stringToColor(str: string) {
    return `hsl(${hashCode(str) % 360}, 100%, 80%)`;
}

export function timestampToDate(ts: number) {
    return new Intl.DateTimeFormat('en-US', { year: '2-digit', month: '2-digit', day: '2-digit' }).format(ts * 1000)
}


export function importAll(r: any) {
    let items: any = {};
    r.keys().map((item: String, index: number) => { return items[item.replace('./', '')] = r(item); });
    return items;
}


export function chainIconPath(name: string, app?: string) {
    if (!name) return;
    let filename = name.toLowerCase();
    if (app)
        filename += `-${app}`;
    filename += '.svg';
    if (CHAIN_ICONS[filename]) {
        return CHAIN_ICONS[filename];
    }
}


export function capitalize(s: string) {
    return s && s[0].toUpperCase() + s.slice(1);
}


export function getQueryVariable(urlParams: string, variable: string): string | undefined {
    const query = urlParams.substring(1);
    const vars = query.split("&");
    for (let i = 0; i < vars.length; i++) {
        const pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
    }
}