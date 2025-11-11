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
 * @file credit-station.ts
 * @copyright SKALE Labs 2025-Present
 */

import { Contract } from 'ethers'
import { MetaportCore } from '@skalenetwork/metaport'
import { skaleContracts } from '@skalenetwork/skale-contracts-ethers-v6'
import { type types, contracts } from '@/core'
import { MAINNET_CHAIN_NAME } from '@/core/constants'

export interface PaymentEvent {
  id: bigint
  schainHash: string
  from: string
  to: string
  tokenAddress: string
  blockNumber: number
  transactionHash: string
}

function getCreditStationAddress(network: types.SkaleNetwork): types.AddressType | undefined {
  return contracts.CONTRACTS[network][contracts.PortalProject.CREDIT_STATION]
}

function getLedgerContractAddress(
  network: types.SkaleNetwork,
  schainName: string
): types.AddressType | undefined {
  return contracts.CREDIT_STATION_LEDGER_CONTRACTS[network][schainName]
}

export async function getCreditStation(mpc: MetaportCore): Promise<Contract | undefined> {
  const address = getCreditStationAddress(mpc.config.skaleNetwork)
  if (!address) return undefined
  const provider = mpc.provider(MAINNET_CHAIN_NAME)
  const network = await skaleContracts.getNetworkByProvider(provider)
  const project = await network.getProject('mainnet-credit-station')
  const instance = await project.getInstance(address)
  return (await instance.getContract('CreditStation')) as Contract
}

export async function getLedgerContract(
  mpc: MetaportCore,
  schainName: string
): Promise<Contract | undefined> {
  const address = getLedgerContractAddress(mpc.config.skaleNetwork, schainName)
  if (!address) return undefined
  const network = await skaleContracts.getNetworkByProvider(mpc.provider(schainName))
  const project = await network.getProject('schain-credit-station')
  const instance = await project.getInstance(address)
  return (await instance.getContract('Ledger')) as Contract
}

export async function getTokenPrices(
  creditStation: Contract | undefined
): Promise<Record<string, bigint> | undefined> {
  if (!creditStation) return
  const supportedTokens: string[] = await creditStation.getSupportedTokens()
  const prices = await Promise.all(
    supportedTokens.map((tokenAddress) => creditStation.getPrice(tokenAddress))
  )
  const priceMap = supportedTokens.reduce(
    (acc, tokenAddress, index) => {
      acc[tokenAddress] = prices[index]
      return acc
    },
    {} as Record<string, bigint>
  )
  return priceMap
}

export async function getPaymentEvents(
  creditStation: Contract | undefined,
  address: string,
  fromBlock?: number
): Promise<PaymentEvent[]> {
  if (!creditStation) return []

  const CHUNK_SIZE = 40000
  const MAX_BLOCKS_TO_SCAN = 500000

  const provider = creditStation.runner?.provider
  if (!provider) return []

  const currentBlock = await provider.getBlockNumber()
  const startBlock = fromBlock ?? currentBlock - MAX_BLOCKS_TO_SCAN
  const endBlock = fromBlock ?? currentBlock

  const filter = creditStation.filters.PaymentReceived(null, null, address)
  const allEvents: import('ethers').EventLog[] = []

  for (let block = startBlock; block <= endBlock; block += CHUNK_SIZE) {
    const toBlock = Math.min(block + CHUNK_SIZE - 1, endBlock)
    const events = await creditStation.queryFilter(filter, block, toBlock)
    const eventLogs = events.filter((event): event is import('ethers').EventLog => 'args' in event)
    allEvents.push(...eventLogs)
  }

  return allEvents.map((event) => ({
    id: event.args.id,
    schainHash: event.args.schainHash,
    from: event.args.from,
    to: event.args.to,
    tokenAddress: event.args.tokenAddress,
    blockNumber: event.blockNumber,
    transactionHash: event.transactionHash
  }))
}
