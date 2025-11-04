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
 * @file eth_chains.ts
 * @copyright SKALE Labs 2023-Present
 */

import type { Chain } from 'wagmi/chains'

export const holesky: Chain = {
  id: 17000,
  name: 'Holesky',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://ethereum-holesky-rpc.publicnode.com'] },
    public: { http: ['https://ethereum-holesky-rpc.publicnode.com'] }
  },
  blockExplorers: {
    default: { name: 'Etherscan', url: 'https://holesky.etherscan.io' },
    etherscan: { name: 'Etherscan', url: 'https://holesky.etherscan.io' }
  }
} as const

export const hoodi: Chain = {
  id: 560048,
  name: 'Hoodi',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://ethereum-hoodi-rpc.publicnode.com'] },
    public: { http: ['https://ethereum-hoodi-rpc.publicnode.com'] }
  },
  blockExplorers: {
    default: { name: 'Etherscan', url: 'https://hoodi.etherscan.io' },
    etherscan: { name: 'Etherscan', url: 'https://hoodi.etherscan.io' }
  }
} as const

export const base_sepolia_testnet: Chain = {
  id: 84532,
  name: 'Base Sepolia Testnet',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://base-sepolia-testnet.rpc.publicnode.com'] },
    public: { http: ['https://base-sepolia-testnet.rpc.publicnode.com'] }
  },
  blockExplorers: {
    default: { name: 'Etherscan', url: 'https://base-sepolia-testnet.etherscan.io' },
    etherscan: { name: 'Etherscan', url: 'https://base-sepolia-testnet.etherscan.io' }
  }
} as const
