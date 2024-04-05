/**
 * @license
 * SKALE portal
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
/**
 * @file contracts.ts
 * @copyright SKALE Labs 2024-Present
 */

import debug from 'debug'
import { type Contract, type AbstractProvider, type Signer } from 'ethers'
import { MulticallWrapper } from 'ethers-multicall-provider'
import { skaleContracts, type Instance } from '@skalenetwork/skale-contracts-ethers-v6'
import { type MetaportCore, type interfaces } from '@skalenetwork/metaport'

import { initSkaleToken } from './delegation'
import { type ContractType, DelegationType, type ISkaleContractsMap } from './interfaces'
import { CONTRACTS_META } from './constants'

debug.enable('*')
const log = debug('portal:core:contracts')

type PROJECT_TYPE = 'manager' | 'allocator' | 'grants'

export async function initContracts(mpc: MetaportCore): Promise<ISkaleContractsMap> {
  log('Initializing contracts')
  const provider = MulticallWrapper.wrap(mpc.provider('mainnet') as AbstractProvider)
  const network = await skaleContracts.getNetworkByProvider(provider)
  const managerProject = await network.getProject('skale-manager')
  const manager = await getInstance(managerProject, mpc.config.skaleNetwork, 'manager')
  const allocatorProject = await network.getProject('skale-allocator')
  const allocator = await getInstance(allocatorProject, mpc.config.skaleNetwork, 'allocator')
  const grantsAllocator = await getInstance(allocatorProject, mpc.config.skaleNetwork, 'grants')
  return {
    validatorService: (await manager.getContract('ValidatorService')) as Contract,
    distributor: (await manager.getContract('Distributor')) as Contract,
    delegationController: (await manager.getContract('DelegationController')) as Contract,
    tokenState: (await manager.getContract('TokenState')) as Contract,
    skaleToken: await initSkaleToken(provider, manager),
    allocator: (await allocator.getContract('Allocator')) as Contract,
    grantsAllocator: (await grantsAllocator.getContract('Allocator')) as Contract
  }
}

export async function initActionContract(
  signer: Signer,
  delegationType: DelegationType,
  beneficiary: interfaces.AddressType,
  skaleNetwork: interfaces.SkaleNetwork,
  contractType: ContractType
): Promise<Contract> {
  log('initActionContract:', skaleNetwork, beneficiary, contractType, delegationType)
  const network = await skaleContracts.getNetworkByProvider(signer.provider!)
  let contract: Contract
  if (delegationType === DelegationType.REGULAR) {
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

function getInstanceTag(skaleNetwork: interfaces.SkaleNetwork, projectName: PROJECT_TYPE): string {
  if (CONTRACTS_META[skaleNetwork].auto) {
    if (projectName === 'grants') return 'grants'
    return 'production'
  }
  return CONTRACTS_META[skaleNetwork][projectName]
}

function connectedContract(contract: Contract, signer: Signer): Contract {
  return contract.connect(signer) as Contract
}

async function getEscrowContract(
  network: any,
  skaleNetwork: interfaces.SkaleNetwork,
  delegationType: DelegationType,
  beneficiary: interfaces.AddressType
): Promise<Contract> {
  const project = await network.getProject('skale-allocator')
  const instance = await getInstance(
    project,
    skaleNetwork,
    delegationType === DelegationType.ESCROW ? 'allocator' : 'grants'
  )
  return (await instance.getContract('Escrow', [beneficiary])) as Contract
}

async function getManagerContract(
  network: any,
  skaleNetwork: interfaces.SkaleNetwork,
  name: string
): Promise<Contract> {
  const managerProject = await network.getProject('skale-manager')
  const manager = await getInstance(managerProject, skaleNetwork, 'manager')
  return (await manager.getContract(name)) as Contract
}

async function getInstance(
  project: any,
  skaleNetwork: interfaces.SkaleNetwork,
  tag: PROJECT_TYPE
): Promise<Instance> {
  return project.getInstance(getInstanceTag(skaleNetwork, tag))
}
