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

import { Logger, type ILogObj } from 'tslog'
import { Contract, ContractRunner, Signer } from 'ethers'
import { skaleContracts } from '@skalenetwork/skale-contracts-ethers-v6'
import { dc, ERC_ABIS, types, contracts } from '@/core'

import SChain from './sChain'
import MainnetChain from './mainnetChain'
import MetaportCore from '../metaport'
import * as paymaster from './paymaster'

export { SChain, MainnetChain, paymaster }

const log = new Logger<ILogObj>({ name: 'portal:core:contracts' })

export function getErcContract(
  signerOrProvider: ContractRunner,
  address: types.AddressType,
  tokenType: dc.TokenTypeExtended
): Contract {
  const type = tokenType.toLowerCase()
  const abi = ERC_ABIS[type]
  return new Contract(address, abi, signerOrProvider)
}

export async function initContracts(mpc: MetaportCore): Promise<types.st.ISkaleContractsMap> {
  log.info('Initializing contracts')
  const provider = mpc.provider('mainnet')
  const network = await skaleContracts.getNetworkByProvider(provider)
  const sn = mpc.config.skaleNetwork

  const managerAlias = contracts.getAliasOrAddress(sn, contracts.Project.MANAGER)
  const managerProject = await network.getProject(contracts.Project.MANAGER)
  const manager = await managerProject.getInstance(managerAlias)

  const allocatorAlias = await contracts.getAliasOrAddress(sn, contracts.Project.ALLOCATOR)
  const allocatorProject = await network.getProject(contracts.Project.ALLOCATOR)
  const allocator = await allocatorProject.getInstance(allocatorAlias)

  const grantsAlias = await contracts.getAliasOrAddress(sn, contracts.PortalProject.GRANTS)
  const grantsAllocator = await allocatorProject.getInstance(grantsAlias)

  return {
    validatorService: (await manager.getContract('ValidatorService')) as Contract,
    distributor: (await manager.getContract('Distributor')) as Contract,
    delegationController: (await manager.getContract('DelegationController')) as Contract,
    tokenState: (await manager.getContract('TokenState')) as Contract,
    skaleToken: (await manager.getContract('SkaleToken')) as Contract,
    allocator: (await allocator.getContract('Allocator')) as Contract,
    grantsAllocator: (await grantsAllocator.getContract('Allocator')) as Contract
  }
}

export async function initActionContract(
  signer: Signer,
  delegationType: types.st.DelegationType,
  beneficiary: types.AddressType,
  skaleNetwork: types.SkaleNetwork,
  contractType: types.st.ContractType
): Promise<Contract> {
  log.info('initActionContract:', skaleNetwork, beneficiary, contractType, delegationType)
  const network = await skaleContracts.getNetworkByProvider(signer.provider!)
  let contract: Contract
  if (delegationType === types.st.DelegationType.REGULAR) {
    contract = await getManagerContract(
      network,
      skaleNetwork,
      contractType === 'delegation' ? 'DelegationController' : 'Distributor'
    )
  } else {
    contract = await getEscrowContract(network, skaleNetwork, delegationType, beneficiary)
  }
  return connectedContract(contract, signer)
}

function connectedContract(contract: Contract, signer: Signer): Contract {
  return contract.connect(signer) as Contract
}

async function getEscrowContract(
  network: any,
  skaleNetwork: types.SkaleNetwork,
  delegationType: types.st.DelegationType,
  beneficiary: types.AddressType
): Promise<Contract> {
  const project = await network.getProject(contracts.Project.ALLOCATOR)
  let type: contracts.IPortalProject = contracts.Project.ALLOCATOR
  if (delegationType === types.st.DelegationType.ESCROW) {
    type = contracts.PortalProject.GRANTS
  }
  const alias = contracts.getAliasOrAddress(skaleNetwork, type)
  const instance = await project.getInstance(alias)
  return (await instance.getContract('Escrow', [beneficiary])) as Contract
}

async function getManagerContract(
  network: any,
  skaleNetwork: types.SkaleNetwork,
  name: string
): Promise<Contract> {
  const project = await network.getProject(contracts.Project.MANAGER)
  const alias = contracts.getAliasOrAddress(skaleNetwork, contracts.Project.MANAGER)
  const manager = await project.getInstance(alias)
  return (await manager.getContract(name)) as Contract
}
