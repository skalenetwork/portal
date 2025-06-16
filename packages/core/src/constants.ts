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

const MS_MULTIPLIER = 1000

export const DEFAULT_ERC20_DECIMALS = 18
export const USDC_DECIMALS = 6

export const DEFAULT_MP_Z_INDEX = 99000

export const MAINNET_CHAIN_NAME = 'mainnet'

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
export const ZERO_FUNCSIG_FAUCET = '0x00000000'

export const DEFAULT_FRACTION_DIGITS = 5
export const ROUNDING_DECIMALS = 6

export const M2S_POSTFIX = 'm2s'
export const S2M_POSTFIX = 's2m'
export const S2S_POSTFIX = 's2s'
export const WRAP_ACTION = 'wrap'
export const UNWRAP_ACTION = 'unwrap'

export const DEFAULT_ERROR_MSG = 'Something went wrong'
export const TRANSFER_ERROR_MSG = 'Error during the transfer'
export const TRANSACTION_ERROR_MSG = 'Transaction sending failed'

export const BASE_METADATA_URL =
   'https://raw.githubusercontent.com/skalenetwork/skale-network/master/metadata/'

export const BASE_TOKEN_ICON_URL =
  'https://raw.githubusercontent.com/skalenetwork/skale-network/refs/heads/master/assets/token-icons/'

export const DEFAULT_SLEEP = 5000
export const DEFAULT_ITERATIONS = 200

export const HTTPS_PREFIX = 'https://'
export const WSS_PREFIX = 'wss://'

export const GRAY_BG = 'rgb(136 135 135 / 15%)'

export const DEFAULT_DELEGATION_PERIOD = 2n
export const DEFAULT_DELEGATION_INFO = 'portal'

const _DEFAULT_UPDATE_INTERVAL_SECONDS = 10
export const DEFAULT_UPDATE_INTERVAL_MS = _DEFAULT_UPDATE_INTERVAL_SECONDS * MS_MULTIPLIER
