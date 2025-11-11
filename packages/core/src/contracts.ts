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

import { types, constants } from '.'

export enum Project {
  MANAGER = 'skale-manager',
  ALLOCATOR = 'skale-allocator',
  MAINNET_IMA = 'mainnet-ima',
}

export enum SchainProject {
  SCHAIN_IMA = 'schain-ima'
}

export enum PortalProject {
  GRANTS = 'skale-grants',
  CREDIT_STATION = 'credit-station'
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
    'skale-grants': '0x1Bf7D9BAFd93945b02441B5f1C161C0dD5f439B3'
  },
  regression: {},
  testnet: {
    'skale-manager': '0x8d3D60BFD4c82B3043e5001b7B38B640A2F27CEb',
    'mainnet-ima': '0x6c0d044a2C5Bcaff75C8ad7894d8b454b005F4D2',
    'skale-allocator': '0xDC2F6568608C8dABe101914489A25b07567C96bC',
    'skale-grants': '0xCEabf2b0c4F9d75A49a7B1E3e3c3179cDe949C9F'
  },
  "base-sepolia-testnet": {
    'skale-manager': '0xd2c33198A5D03E5Da2784FbE4BfDd9a8A5862A9A',
    'mainnet-ima': '0xA1e244C6cE94FF2bb5f4533783FBc44D1f190045',
    'skale-allocator': constants.ZERO_ADDRESS,
    'skale-grants': constants.ZERO_ADDRESS,
    'credit-station': '0x25B6CF1f87fA65Ea0FDE87Ec4411d4E311557064'
  },
  base: {
    'skale-manager': constants.ZERO_ADDRESS,
    'mainnet-ima': constants.ZERO_ADDRESS,
    'skale-allocator': constants.ZERO_ADDRESS,
    'skale-grants': constants.ZERO_ADDRESS
  },
}

export const CREDIT_STATION_LEDGER_CONTRACTS: {
  [key in types.SkaleNetwork]: { [key: string]: types.AddressType } } = {
  mainnet: {},
  legacy: {},
  regression: {},
  testnet: {},
  base: {},
  'base-sepolia-testnet': {
    'jubilant-horrible-ancha': '0xA97A47eCB389a74BDb4ff62F205CBE79F612e67C'
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
    chain: 'honored-impish-wezen',
    address: '0xd9FA9a9A68D7A5C518Ad1FE5A75ed892Cd1765db'
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
