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

import { Contract, type JsonRpcSigner } from 'ethers'
import { MetaportCore, walletClientToSigner, enforceNetwork } from '@skalenetwork/metaport'
import { skaleContracts } from '@skalenetwork/skale-contracts-ethers-v6'
import { type types, contracts, helper } from '@/core'

export interface Payment {
  id: bigint
  sourceId: string
  schainHash: string
  schainName: string
  from: `0x${string}`
  to: `0x${string}`
  tokenAddress: `0x${string}`
  blockNumber: number
  value: bigint
}

const PAYMENT_ID_PAYLOAD_MASK = (1n << 192n) - 1n

export function getLedgerPaymentId(id: bigint): bigint {
  return id & PAYMENT_ID_PAYLOAD_MASK
}

export function getCreditStationSources(
  network: types.SkaleNetwork
): contracts.CreditStationSource[] {
  return contracts.CREDIT_STATION_SOURCES[network] ?? []
}

export async function ensureGasBalance(signer: JsonRpcSigner): Promise<void> {
  const balance = await signer.provider.getBalance(signer.address)
  if (balance === 0n) {
    throw new Error('Insufficient ETH balance to pay for gas fees')
  }
}

export async function prepareSignerForWrite(
  contract: Contract,
  walletClient: Parameters<typeof walletClientToSigner>[0],
  switchChainAsync: Parameters<typeof enforceNetwork>[2],
  network: types.SkaleNetwork,
  chainName: string
): Promise<JsonRpcSigner> {
  if (!contract.runner?.provider || !walletClient || !switchChainAsync) {
    throw new Error('Something is wrong with your wallet, try again')
  }
  const { chainId } = await contract.runner.provider.getNetwork()
  await enforceNetwork(chainId, walletClient, switchChainAsync, network, chainName)
  const signer = walletClientToSigner(walletClient)
  await ensureGasBalance(signer)
  return signer
}

export async function initAllLedgerContracts(
  mpc: MetaportCore,
  schains: types.ISChain[]
): Promise<Record<string, Contract>> {
  const results = await Promise.all(
    schains.map(async (schain) => [schain.name, await getLedgerContract(mpc, schain.name)])
  )
  return Object.fromEntries(results.filter(([_, contract]) => contract !== undefined))
}

function getLedgerContractAddress(
  network: types.SkaleNetwork,
  schainName: string
): types.AddressType | undefined {
  return contracts.CREDIT_STATION_LEDGER_CONTRACTS[network][schainName]
}

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

function isValidAddress(address: string | undefined): boolean {
  return address !== undefined && address !== ZERO_ADDRESS
}

export async function getCreditStationForSource(
  mpc: MetaportCore,
  source: contracts.CreditStationSource
): Promise<Contract | undefined> {
  if (!isValidAddress(source.contractAddress)) return undefined
  const provider = mpc.provider(source.chainName)
  const network = await skaleContracts.getNetworkByProvider(provider)
  const project = await network.getProject(source.skaleContractsProject as any)
  const instance = await project.getInstance(source.contractAddress)
  return (await instance.getContract('CreditStation')) as Contract
}

export async function initAllCreditStations(
  mpc: MetaportCore,
  sources: contracts.CreditStationSource[]
): Promise<Record<string, Contract>> {
  const entries = await Promise.all(
    sources.map(async (source) => {
      try {
        const contract = await getCreditStationForSource(mpc, source)
        return [source.id, contract] as const
      } catch (error) {
        console.error(`Failed to init credit station for source ${source.id}:`, error)
        return [source.id, undefined] as const
      }
    })
  )
  return Object.fromEntries(
    entries.filter(([, contract]) => contract !== undefined) as [string, Contract][]
  )
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

export async function getTokenPricesBySource(
  creditStations: Record<string, Contract>
): Promise<Record<string, Record<string, bigint>>> {
  const entries = await Promise.all(
    Object.entries(creditStations).map(async ([sourceId, contract]) => {
      const prices = (await getTokenPrices(contract)) ?? {}
      return [sourceId, prices] as const
    })
  )
  return Object.fromEntries(entries)
}

async function getPayments(
  paymentIds: bigint[],
  creditStation: Contract,
  sourceId: string,
  schains: types.ISChain[]
): Promise<Payment[]> {
  const allIds = Array.from(paymentIds)
  const chunkSize = 10
  const results: Payment[] = []

  for (let i = 0; i < allIds.length; i += chunkSize) {
    const chunk = allIds.slice(i, i + chunkSize)
    const chunkPayments = await Promise.all(
      chunk.map(async (paymentId) => {
        const rawPayment = await creditStation.getPaymentInfo(paymentId)
        return toPayment(paymentId, sourceId, rawPayment, schains)
      })
    )
    results.push(...chunkPayments)
  }
  return results
}

export async function getPaymentsByAddress(
  creditStation: Contract | undefined,
  sourceId: string,
  address: string,
  schains: types.ISChain[]
): Promise<Payment[]> {
  if (!creditStation) return []
  const numberOfPayments = await creditStation.getNumberOfPayments(address)
  const paymentIds = await creditStation.getPaymentIds(address, 0, numberOfPayments)
  return await getPayments(paymentIds, creditStation, sourceId, schains)
}

export async function getAllPayments(
  creditStation: Contract | undefined,
  sourceId: string,
  schains: types.ISChain[]
): Promise<Payment[]> {
  if (!creditStation) return []
  const lastPaymentId = await creditStation.getLastPaymentId()
  return getPayments(
    Array.from({ length: Number(lastPaymentId) }, (_, i) => BigInt(i + 1)),
    creditStation,
    sourceId,
    schains
  )
}

export async function getPaymentsAcrossSourcesByAddress(
  creditStations: Record<string, Contract>,
  address: string,
  schains: types.ISChain[]
): Promise<Payment[]> {
  const results = await Promise.all(
    Object.entries(creditStations).map(([sourceId, contract]) =>
      getPaymentsByAddress(contract, sourceId, address, schains).catch((error) => {
        console.error(`Failed to fetch payments for source ${sourceId}:`, error)
        return [] as Payment[]
      })
    )
  )
  return results.flat()
}

export async function getAllPaymentsAcrossSources(
  creditStations: Record<string, Contract>,
  schains: types.ISChain[]
): Promise<Payment[]> {
  const results = await Promise.all(
    Object.entries(creditStations).map(([sourceId, contract]) =>
      getAllPayments(contract, sourceId, schains).catch((error) => {
        console.error(`Failed to fetch payments for source ${sourceId}:`, error)
        return [] as Payment[]
      })
    )
  )
  return results.flat()
}

function toPayment(
  id: bigint,
  sourceId: string,
  data: any,
  schains: types.ISChain[]
): Payment {
  const schainName = schains.find((s) => helper.schainNameToHash(s.name) === data[0])?.name || ''
  return {
    id,
    sourceId,
    schainHash: data[0],
    schainName: schainName,
    from: data[1],
    to: data[2],
    blockNumber: Number(data[3]),
    tokenAddress: data[4],
    value: BigInt(data[5] ?? 0n)
  }
}
