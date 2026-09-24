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
import { type PublicClient } from 'viem'
import { skaleContracts } from '@skalenetwork/skale-contracts-viem'
import { types, contracts, constants } from '@/core'

import SChain from './sChain'
import MainnetChain from './mainnetChain'
import MetaportCore from '../metaport'
import * as paymaster from './paymaster'

export { SChain, MainnetChain, paymaster }

const log = new Logger<ILogObj>({ name: 'portal:core:contracts' })

export async function initContracts(mpc: MetaportCore): Promise<types.st.ISkaleContractsMap> {
  log.info('Initializing contracts')
  const client = mpc.publicClient(constants.MAINNET_CHAIN_NAME)
  const network = await skaleContracts.getNetworkByProvider(client)
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
    validatorService: await manager.getContract('ValidatorService'),
    distributor: await manager.getContract('Distributor'),
    delegationController: await manager.getContract('DelegationController'),
    tokenState: await manager.getContract('TokenState'),
    skaleToken: await manager.getContract('SkaleToken'),
    allocator: await allocator.getContract('Allocator'),
    grantsAllocator: await grantsAllocator.getContract('Allocator'),
    client
  }
}

export async function initActionContract(
  client: PublicClient,
  delegationType: types.st.DelegationType,
  beneficiary: types.AddressType,
  skaleNetwork: types.SkaleNetwork,
  contractType: types.st.ContractType
): Promise<types.st.SkaleContract> {
  log.info('initActionContract:', skaleNetwork, beneficiary, contractType, delegationType)
  const network = await skaleContracts.getNetworkByProvider(client)
  let contract: types.st.SkaleContract
  if (delegationType === types.st.DelegationType.REGULAR) {
    contract = await getManagerContract(
      network,
      skaleNetwork,
      contractType === 'delegation' ? 'DelegationController' : 'Distributor'
    )
  } else {
    contract = await getEscrowContract(network, skaleNetwork, delegationType, beneficiary)
  }
  return contract
}

async function getEscrowContract(
  network: any,
  skaleNetwork: types.SkaleNetwork,
  delegationType: types.st.DelegationType,
  beneficiary: types.AddressType
): Promise<types.st.SkaleContract> {
  const project = await network.getProject(contracts.Project.ALLOCATOR)
  let type: contracts.IPortalProject = contracts.Project.ALLOCATOR
  if (delegationType === types.st.DelegationType.ESCROW2) {
    type = contracts.PortalProject.GRANTS
  }
  const alias = contracts.getAliasOrAddress(skaleNetwork, type)
  const instance = await project.getInstance(alias)
  return (await instance.getContract('Escrow', [beneficiary])) as types.st.SkaleContract
}

async function getManagerContract(
  network: any,
  skaleNetwork: types.SkaleNetwork,
  name: string
): Promise<types.st.SkaleContract> {
  const project = await network.getProject(contracts.Project.MANAGER)
  const alias = contracts.getAliasOrAddress(skaleNetwork, contracts.Project.MANAGER)
  const manager = await project.getInstance(alias)
  return (await manager.getContract(name)) as types.st.SkaleContract
}
