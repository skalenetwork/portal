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

export const DASHBOARD_URL = 'https://app.geckoboard.com/v5/dashboards/LISYTRBEVGCVGL57/inception'
export const DUNE_SKALE_URL = 'https://dune.com/projects/SKALE'


export const BRIDGE_PAGES = ['/bridge', '/transfer', '/bridge/history', '/portfolio', '/other/faq']
export const STAKING_PAGES = ['/staking']

export const PORTAL_URLS: Record<string, string> = {
  mainnet: 'https://portal.skale.space/',
  staging: 'https://testnet.portal.skale.space/'
}

export { FAQ, MAINNET_CHAIN_LOGOS, VALIDATOR_LOGOS }

export const AVG_MONTH_LENGTH = 30.436875

const _BALANCE_UPDATE_INTERVAL_SECONDS = 25
export const BALANCE_UPDATE_INTERVAL_MS = _BALANCE_UPDATE_INTERVAL_SECONDS * 1000

export const TRANSAK_STAGING_ENV = import.meta.env.VITE_TRANSAK_STAGING_ENV === 'true'
export const TRANSAK_API_KEY = import.meta.env.VITE_TRANSAK_API_KEY
export const DISABLE_TRANSAK = import.meta.env.VITE_DISABLE_TRANSAK === 'true'

export const STATS_API: { [key in types.SkaleNetwork]: string | null } = {
  mainnet: 'https://stats.explorer.mainnet.skalenodes.com/v2/stats/',
  testnet: null,
  legacy: null,
  regression: null
}

export const MAX_APPS_DEFAULT = 12
export const APP_SUBCATEGORY_MATCH_WEIGHT = 2

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
  website: 'https://skale.space/',
  dune: DUNE_SKALE_URL,
  forum: 'https://forum.skale.network/'
}

export const GET_STARTED_URL = 'https://skale.space/get-started-on-skale'

export const DEFAULT_MIN_SFUEL_WEI = 100000000000000
export const SFUEL_CHECK_INTERVAL = 10000
export const DOCS_PORTAL_URL = 'https://docs.skale.space/'
export const SKALE_FORUM_URL = 'https://forum.skale.network/'

export const ITEMS_PER_PAGE = 100
export const BATCH_SIZE = 150

export const PATH_CONFIGS = {
  '/ecosystem': {
    attempts: [0, 5, 10, 15, 20, 25, 30, 40, 50, 75, 100, 150, 200, 300],
    priority: 'high'
  }
}
export type PathConfigsType = typeof PATH_CONFIGS
