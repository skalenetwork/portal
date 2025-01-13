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
 * @file wagmi_network.ts
 * @copyright SKALE Labs 2023-Present
 */

import { Chain } from 'wagmi/chains'
import { types } from '@/core'

import { getSChainEndpoint } from './network'
import { getExplorerUrl } from './explorer'
import { getChainAlias } from './metadata'
import { getChainId } from './chain_id'

export function constructWagmiChain(network: types.SkaleNetwork, chainName: string): Chain {
  const endpointHttp = getSChainEndpoint(network, chainName)
  const endpointWs = getSChainEndpoint(network, chainName, 'ws')
  const explorerUrl = getExplorerUrl(network, chainName)
  const name = getChainAlias(network, chainName)
  const chainId = getChainId(chainName)
  return {
    id: chainId,
    name: name,
    nativeCurrency: {
      decimals: 18,
      name: 'sFUEL',
      symbol: 'sFUEL'
    },
    rpcUrls: {
      public: { http: [endpointHttp], webSocket: [endpointWs] },
      default: { http: [endpointHttp], webSocket: [endpointWs] }
    },
    blockExplorers: {
      etherscan: { name: 'SKALE Explorer', url: explorerUrl },
      default: { name: 'SKALE Explorer', url: explorerUrl }
    },
    contracts: {}
  } as const satisfies Chain
}
