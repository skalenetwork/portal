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
 * @file index.ts
 * @copyright SKALE Labs 2025-Present
 */

import { Contract, ContractRunner, Provider } from 'ethers'
import { skaleContracts, type Instance } from '@skalenetwork/skale-contracts-ethers-v6'
import { dc, ERC_ABIS, types, contracts } from '@/core'

import SChain from './SChain'
import MainnetChain from './MainnetChain'

export { SChain, MainnetChain }

export async function getInstance(
    provider: Provider,
    projectName: contracts.SkaleContractsProject,
    aliasOrAddress: string
): Promise<Instance> {
    const network = await skaleContracts.getNetworkByProvider(provider)
    const project = await network.getProject(projectName)
    return await project.getInstance(aliasOrAddress)
}

export function getErcContract(
    signerOrProvider: ContractRunner,
    address: types.AddressType,
    tokenType: dc.TokenTypeExtended
): Contract {
    const type = tokenType.toLowerCase()
    const abi = ERC_ABIS[type]
    return new Contract(address, abi, signerOrProvider)
}

