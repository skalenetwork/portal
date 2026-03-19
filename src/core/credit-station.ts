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
import { MAINNET_CHAIN_NAME } from '@/core/constants'

export interface Payment {
  id: bigint
  schainHash: string
  schainName: string
  from: `0x${string}`
  to: `0x${string}`
  tokenAddress: `0x${string}`
  blockNumber: number
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

async function getPayments(
  paymentIds: bigint[],
  creditStation: Contract,
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
        return toPayment(paymentId, rawPayment, schains)
      })
    )
    results.push(...chunkPayments)
  }
  return results
}

export async function getPaymentsByAddress(
  creditStation: Contract | undefined,
  address: string,
  schains: types.ISChain[]
): Promise<Payment[]> {
  if (!creditStation) return []
  const numberOfPayments = await creditStation.getNumberOfPayments(address)
  const paymentIds = await creditStation.getPaymentIds(address, 0, numberOfPayments)
  return await getPayments(paymentIds, creditStation, schains)
}

export async function getAllPayments(
  creditStation: Contract | undefined,
  schains: types.ISChain[]
): Promise<Payment[]> {
  if (!creditStation) return []
  const lastPaymentId = await creditStation.getLastPaymentId()
  return getPayments(
    Array.from({ length: Number(lastPaymentId) }, (_, i) => BigInt(i + 1)),
    creditStation,
    schains
  )
}

function toPayment(id: bigint, data: any, schains: types.ISChain[]): Payment {
  const schainName = schains.find((s) => helper.schainNameToHash(s.name) === data[0])?.name || ''
  return {
    id,
    schainHash: data[0],
    schainName: schainName,
    from: data[1],
    to: data[2],
    blockNumber: Number(data[3]),
    tokenAddress: data[4]
  }
}
