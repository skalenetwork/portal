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
 * @file constants.ts
 * @copyright SKALE Labs 2022-Present
 */

export const M2S_POSTFIX = 'm2s'
export const S2M_POSTFIX = 's2m'
export const S2S_POSTFIX = 's2s'
export const WRAP_ACTION = 'wrap'
export const UNWRAP_ACTION = 'unwrap'

export const ICONS_BASE_URL =
  'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/'

export const MAX_NUMBER = 2n ** 256n - 1n

export const DEFAULT_MIN_SFUEL_WEI = 21000000000000n

export const DEFAULT_ERROR_MSG = 'Ooops... Something went wrong...'
export const TRANSFER_ERROR_MSG = 'Error during the transfer'

export const DEFAULT_MP_MARGIN = '20pt'
export const DEFAULT_MP_Z_INDEX = 99000

export const SFUEL_TEXT = {
  sfuel: {
    warning: 'You need sFUEL on the destination chain',
    error: 'You need sFUEL to perform a transfer'
  },
  gas: {
    warning: 'You need ETH on the destination chain',
    error: 'You need ETH on Mainnet to perform a transfer'
  }
}

// community pool

export const RECHARGE_MULTIPLIER = 1.1
export const MINIMUM_RECHARGE_AMOUNT = 0.001
export const COMMUNITY_POOL_ESTIMATE_GAS_LIMIT = 1000000n
export const COMMUNITY_POOL_WITHDRAW_GAS_LIMIT = 150000n
export const _BALANCE_UPDATE_INTERVAL_SECONDS = 10
export const BALANCE_UPDATE_INTERVAL_MS = _BALANCE_UPDATE_INTERVAL_SECONDS * 1000
export const COMMUNITY_POOL_DECIMALS = 6

export const SFUEL_RESERVE_AMOUNT = 0.01

export const SUCCESS_EMOJIS = ['🎉', '👌', '✅', '🙌', '🎊']
