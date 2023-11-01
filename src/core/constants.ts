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
 * @file constants.ts
 * @copyright SKALE Labs 2022-Present
 */

import FAQ from '../faq.json'

export const MAINNET_CHAIN_NAME = 'mainnet'

export const DASHBOARD_URL = 'https://app.geckoboard.com/v5/dashboards/LISYTRBEVGCVGL57/inception'
export const DUNE_SKALE_URL = 'https://dune.com/projects/SKALE'

export const BRIDGE_PAGES = ['/transfer', '/bridge/history', '/portfolio', '/other/faq']

export const DEFAULT_ERC20_DECIMALS = '18'

export const PORTAL_URLS: { [network: string]: string } = {
  mainnet: 'https://portal.skale.space/',
  staging: 'https://testnet.portal.skale.space/'
}

import * as MAINNET_CHAIN_LOGOS from '../meta/logos'

export { FAQ, MAINNET_CHAIN_LOGOS }
