/**
 * @license
 * SKALE Portal
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
 * @file endpoints.ts
 * @copyright SKALE Labs 2025-Present
 */

import { type types, constants } from '.'

export type EndpointsNetworkMap = {
  [key in types.SkaleNetwork]: string
}

const PROTOCOL: { [protocol in 'http' | 'ws']: string } = {
  http: 'https://',
  ws: 'wss://'
}

export const MAINNET_EXPLORER_URLS: EndpointsNetworkMap = {
  mainnet: 'https://etherscan.io',
  legacy: 'https://holesky.etherscan.io',
  regression: 'https://goerli.etherscan.io',
  testnet: 'https://holesky.etherscan.io'
}

export const BASE_EXPLORER_URLS: EndpointsNetworkMap = {
  mainnet: 'explorer.mainnet.skalenodes.com',
  legacy: 'legacy-explorer.skalenodes.com',
  regression: 'regression-explorer.skalenodes.com',
  testnet: 'explorer.testnet.skalenodes.com'
}

const PROXY_ENDPOINTS: EndpointsNetworkMap = {
  mainnet: 'mainnet.skalenodes.com',
  legacy: 'legacy-proxy.skaleserver.com',
  regression: 'regression-proxy.skalenodes.com',
  testnet: 'testnet.skalenodes.com'
}

export function getProxyEndpoint(network: types.SkaleNetwork) {
  return PROXY_ENDPOINTS[network]
}

export function get(
  mainnetEndpoint: string,
  network: types.SkaleNetwork,
  chainName: string
): string {
  if (chainName === constants.MAINNET_CHAIN_NAME) return mainnetEndpoint
  return schain(network, chainName)
}

export function schain(
  network: types.SkaleNetwork,
  sChainName: string,
  protocol: 'http' | 'ws' = 'http'
): string {
  return (
    PROTOCOL[protocol] +
    getProxyEndpoint(network) +
    '/v1/' +
    (protocol === 'ws' ? 'ws/' : '') +
    sChainName
  )
}
