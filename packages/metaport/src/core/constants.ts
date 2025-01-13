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

export const MAINNET_CHAIN_NAME = 'mainnet'

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const M2S_POSTFIX = 'm2s'
export const S2M_POSTFIX = 's2m'
export const S2S_POSTFIX = 's2s'
export const WRAP_ACTION = 'wrap'
export const UNWRAP_ACTION = 'unwrap'

export const ICONS_BASE_URL =
  'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/'

export const MAX_NUMBER = 2n ** 256n - 1n

// tslint:disable-next-line
export const MAX_APPROVE_AMOUNT =
  '115792089237316195423570985008687907853269984665640564039457584007913129639935' // (2^256 - 1 )

export const DEFAULT_MIN_SFUEL_WEI = 21000000000000n

export const DEFAULT_ERC20_DECIMALS = '18'
export const DEFAULT_ERROR_MSG = 'Ooops... Something went wrong...'
export const TRANSFER_ERROR_MSG = 'Error during the transfer'
export const TRANSACTION_ERROR_MSG = 'Transaction sending failed'

export const DEFAULT_MP_MARGIN = '20pt'
export const DEFAULT_MP_Z_INDEX = 99000

export const HTTPS_PREFIX = 'https://'

export const MAINNET_EXPLORER_URLS: { [skaleNetwork: string]: string } = {
  mainnet: 'https://etherscan.io',
  legacy: 'https://holesky.etherscan.io/',
  regression: 'https://goerli.etherscan.io/',
  testnet: 'https://holesky.etherscan.io/'
}

export const BASE_EXPLORER_URLS: { [skaleNetwork: string]: string } = {
  mainnet: 'explorer.mainnet.skalenodes.com',
  legacy: 'legacy-explorer.skalenodes.com',
  regression: 'regression-explorer.skalenodes.com',
  testnet: 'explorer.testnet.skalenodes.com'
}

export const MAINNET_WS_ENDPOINTS: { [skaleNetwork: string]: string } = {
  mainnet: 'wss://ethereum.publicnode.com',
  legacy: 'wss://ethereum-holesky.publicnode.com',
  regression: 'wss://ethereum-goerli.publicnode.com',
  testnet: 'wss://ethereum-holesky.publicnode.com'
}

// ETA constants

export const IMA_M2S_WAIT = 5
export const IMA_S2S_WAIT = 2
export const IMA_HUB_WAIT = 5

// ETF constants

export const DEFAULT_FAUCET_URL = 'https://sfuel.skale.network/'
export const SFUEL_CHECKS_INTERVAL = 8

export const SFUEL_TEXT = {
  sfuel: {
    warning: 'You need sFUEL on the destination chain',
    error: 'You need sFUEL to perform a transfer'
  },
  gas: {
    warning: 'You need ETH on the destination chain',
    error: 'You need ETH to perform a transfer'
  }
}

// faucet constants

export const ZERO_FUNCSIG = '0x00000000'

// community pool

export const RECHARGE_MULTIPLIER = 1.1
export const MINIMUM_RECHARGE_AMOUNT = 0.000005
export const COMMUNITY_POOL_ESTIMATE_GAS_LIMIT = 1000000n
export const COMMUNITY_POOL_WITHDRAW_GAS_LIMIT = 150000n
export const _BALANCE_UPDATE_INTERVAL_SECONDS = 10
export const BALANCE_UPDATE_INTERVAL_MS = _BALANCE_UPDATE_INTERVAL_SECONDS * 1000
export const COMMUNITY_POOL_DECIMALS = 6

export const SFUEL_RESERVE_AMOUNT = 0.01

export const SUCCESS_EMOJIS = ['🎉', '👌', '✅', '🙌', '🎊']

export const GRAY_BG = 'rgb(136 135 135 / 15%)'

export const DEFAULT_SLEEP = 4000
export const DEFAULT_ITERATIONS = 60
