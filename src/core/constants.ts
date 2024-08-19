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

import { type types } from '@/core'
import FAQ from '../data/faq.json'

import * as MAINNET_CHAIN_LOGOS from '../meta/logos'
import * as VALIDATOR_LOGOS from '../assets/validators'

import { CONTRACTS_META } from '../data/contractsMeta.ts'

export const MAINNET_CHAIN_NAME = 'mainnet'

export const DASHBOARD_URL = 'https://app.geckoboard.com/v5/dashboards/LISYTRBEVGCVGL57/inception'
export const DUNE_SKALE_URL = 'https://dune.com/projects/SKALE'
export const MAIN_SKALE_URL = 'https://skale.space/'

export const BRIDGE_PAGES = ['/bridge', '/transfer', '/bridge/history', '/portfolio', '/other/faq']
export const STAKING_PAGES = ['/staking']

export const DEFAULT_ERC20_DECIMALS = '18'
export const USDC_DECIMALS = '6'

export const PORTAL_URLS: Record<string, string> = {
  mainnet: 'https://portal.skale.space/',
  staging: 'https://testnet.portal.skale.space/'
}

export { FAQ, MAINNET_CHAIN_LOGOS, VALIDATOR_LOGOS, CONTRACTS_META }

export const DISCORD_INVITE_URL = 'https://discord.com/invite/gM5XBy6'

export const MS_MULTIPLIER = 1000
export const AVG_MONTH_LENGTH = 30.436875

const _DEFAULT_UPDATE_INTERVAL_SECONDS = 10
export const DEFAULT_UPDATE_INTERVAL_MS = _DEFAULT_UPDATE_INTERVAL_SECONDS * MS_MULTIPLIER

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
export const DEFAULT_FRACTION_DIGITS = 5

export const DEFAULT_ERROR_MSG = 'Something went wrong'

export const DEFAULT_DELEGATION_PERIOD = 2n
export const DEFAULT_DELEGATION_INFO = 'portal'

const _BALANCE_UPDATE_INTERVAL_SECONDS = 25
export const BALANCE_UPDATE_INTERVAL_MS = _BALANCE_UPDATE_INTERVAL_SECONDS * 1000

export const TRANSAK_STAGING_ENV = import.meta.env.VITE_TRANSAK_STAGING_ENV === 'true'
export const TRANSAK_API_KEY = import.meta.env.VITE_TRANSAK_API_KEY

export const DAPP_RADAR_BASE_URL = 'https://dappradar.com/dapp/'

export const STATS_API: { [key in types.SkaleNetwork]: string | null } = {
  mainnet: 'https://stats.explorer.mainnet.skalenodes.com/v2/stats/',
  testnet: null,
  legacy: null,
  regression: null
}

export const BASE_METADATA_URL =
  'https://raw.githubusercontent.com/skalenetwork/skale-network/master/metadata/'

export const MAX_APPS_DEFAULT = 12

export const OFFCHAIN_APP = '__offchain'

export const SUBMIT_PROJECT_URL =
  'https://github.com/skalenetwork/skale-network/issues/new?assignees=dmytrotkk&labels=metadata&projects=&template=app_submission.yml&title=App+Metadata+Submission'

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/api'
export const LIKES_REFRESH_INTERVAL = 20000

export const SKALE_SOCIAL_LINKS = {
  x: 'https://twitter.com/skalenetwork',
  telegram: 'https://t.me/skaleofficial',
  discord: 'https://discord.com/invite/gM5XBy6',
  github: 'https://github.com/skalenetwork',
  swell: 'https://swell.skale.space/',
  website: 'https://skale.space/'
}
