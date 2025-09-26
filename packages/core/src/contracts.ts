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
 * @file contracts.ts
 * @copyright SKALE Labs 2025-Present
 */

import { types } from '.'

export enum Project {
  MANAGER = 'skale-manager',
  ALLOCATOR = 'skale-allocator',
  MAINNET_IMA = 'mainnet-ima'
}

export enum SchainProject {
  SCHAIN_IMA = 'schain-ima'
}

export enum PortalProject {
  GRANTS = 'skale-grants'
}

export type ISkaleContractsProject = Project | SchainProject
export type IPortalProject = Project | PortalProject

export type ContractAddresses = {
  [project in IPortalProject]?: types.AddressType
}

export type ContractsConfig = {
  [network in types.SkaleNetwork]: ContractAddresses
}

export type SkaleManagerContracts = 'Nodes' | 'SChains'
export type SkaleAllocatorContracts = 'Escrow'
export type IMAContracts = 'TokenManager' | 'Linker'

export const PREDEPLOYED_ALIAS = 'predeployed'

export const CONTRACTS: ContractsConfig = {
  mainnet: {},
  legacy: {
    'skale-manager': '0x3E51d380a5A652bAecDE4BBAC62325f7C506dD4C',
    'mainnet-ima': '0x518b7661F6Ef6170a5AB99eecC545621B81D054b',
    'skale-allocator': '0x9dC47fce435e32779E03AD3dD24015479b9286D9',
    'skale-grants': '0x3982411D90792aCDaCBa37b1fE2f23E4A3E97429'
  },
  regression: {},
  testnet: {
    'skale-manager': '0x8d3D60BFD4c82B3043e5001b7B38B640A2F27CEb',
    'mainnet-ima': '0x6c0d044a2C5Bcaff75C8ad7894d8b454b005F4D2',
    'skale-allocator': '0xDC2F6568608C8dABe101914489A25b07567C96bC',
    'skale-grants': '0xCEabf2b0c4F9d75A49a7B1E3e3c3179cDe949C9F'
  }
}

export const PAYMASTER_CONTRACTS = {
  mainnet: {
    chain: 'elated-tan-skat',
    address: '0x0d66cA00CbAD4219734D7FDF921dD7Caadc1F78D'
  },
  staging: {
    chain: 'staging-legal-crazy-castor',
    address: '0x9E444978d11E7e753017ce3329B01663D5D78240'
  },
  legacy: {
    chain: 'international-villainous-zaurak',
    address: ' 0x9891d98E976dC8c6a65a26208Ab17718434dA1c5'
  },
  regression: {
    chain: '',
    address: '0x'
  },
  testnet: {
    chain: '',
    address: '0x'
  }
}

export function getAliasOrAddress(
  skaleNetwork: types.SkaleNetwork,
  projectName: IPortalProject
): string {
  if (Object.keys(CONTRACTS[skaleNetwork]).length === 0) {
    if (projectName === 'skale-grants') return 'grants'
    return 'production'
  }
  return CONTRACTS[skaleNetwork][projectName] as types.AddressType
}
