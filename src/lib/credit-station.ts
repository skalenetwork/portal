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

import {
  BaseError,
  ContractFunctionRevertedError,
  parseAbi,
  publicActions,
  type PublicClient,
  type WalletClient
} from 'viem'
import { MetaportCore, enforceNetwork } from '@/bridge'
import { skaleContracts, type Instance } from '@skalenetwork/skale-contracts-viem'
import { type types, constants, contracts, helper } from '@/core'

export type CreditContract = Awaited<ReturnType<Instance['getContract']>>

/** A skale-contracts contract bundled with the client that can read it. */
export interface ChainContract {
  contract: CreditContract
  client: PublicClient
  chainName: string
}

/** getPaymentInfo returns a single all-named tuple, so viem decodes it to an object. */
interface RawPayment {
  schainHash: `0x${string}`
  from: types.AddressType
  to: types.AddressType
  blockNumber: bigint
  tokenAddress: types.AddressType
  value: bigint
}

export interface Payment {
  id: bigint
  sourceId: string
  schainHash: string
  schainName: string
  from: `0x${string}`
  to: `0x${string}`
  tokenAddress: `0x${string}`
  blockNumber: number
  timestamp: number
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

export async function ensureGasBalance(walletClient: WalletClient): Promise<void> {
  const balance = await walletClient
    .extend(publicActions)
    .getBalance({ address: walletClient.account!.address })
  if (balance === 0n) {
    throw new Error('Insufficient ETH balance to pay for gas fees')
  }
}

export async function prepareWalletForWrite(
  walletClient: WalletClient | undefined,
  switchChainAsync: Parameters<typeof enforceNetwork>[1],
  network: types.SkaleNetwork,
  chainName: string
): Promise<WalletClient> {
  if (!walletClient || !switchChainAsync) {
    throw new Error('Something is wrong with your wallet, try again')
  }
  await enforceNetwork(walletClient, switchChainAsync, network, chainName)
  await ensureGasBalance(walletClient)
  return walletClient
}

export async function initAllLedgerContracts(
  mpc: MetaportCore,
  schains: types.ISChain[]
): Promise<Record<string, ChainContract>> {
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
): Promise<ChainContract | undefined> {
  if (!isValidAddress(source.contractAddress)) return undefined
  const client = mpc.publicClient(source.chainName)
  const network = await skaleContracts.getNetworkByProvider(client)
  const project = await network.getProject(source.skaleContractsProject as any)
  const instance = await project.getInstance(source.contractAddress)
  return {
    contract: await instance.getContract('CreditStation'),
    client,
    chainName: source.chainName
  }
}

export async function initAllCreditStations(
  mpc: MetaportCore,
  sources: contracts.CreditStationSource[]
): Promise<Record<string, ChainContract>> {
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
    entries.filter(([, contract]) => contract !== undefined) as [string, ChainContract][]
  )
}

export async function getLedgerContract(
  mpc: MetaportCore,
  schainName: string
): Promise<ChainContract | undefined> {
  const address = getLedgerContractAddress(mpc.config.skaleNetwork, schainName)
  if (!address) return undefined
  const client = mpc.publicClient(schainName)
  const network = await skaleContracts.getNetworkByProvider(client)
  const project = await network.getProject('schain-credit-station')
  const instance = await project.getInstance(address)
  return { contract: await instance.getContract('Ledger'), client, chainName: schainName }
}

export interface TokenInfo {
  symbol?: string
  name?: string
  decimals?: number
}

const ERC20_METADATA_ABI = parseAbi([
  'function symbol() view returns (string)',
  'function name() view returns (string)',
  'function decimals() view returns (uint8)'
])
const tokenInfoCache: Record<string, Promise<TokenInfo>> = {}

export async function getTokenInfo(
  mpc: MetaportCore,
  chainName: string,
  tokenAddress: string
): Promise<TokenInfo> {
  const cacheKey = `${chainName}:${tokenAddress.toLowerCase()}`
  if (!(cacheKey in tokenInfoCache)) {
    tokenInfoCache[cacheKey] = (async () => {
      const client = mpc.publicClient(chainName)
      const token = { address: tokenAddress as types.AddressType, abi: ERC20_METADATA_ABI }
      const [symbol, name, decimals] = await Promise.allSettled([
        client.readContract({ ...token, functionName: 'symbol' }),
        client.readContract({ ...token, functionName: 'name' }),
        client.readContract({ ...token, functionName: 'decimals' })
      ])
      if (symbol.status === 'rejected') {
        console.error(
          `Failed to get metadata for token ${tokenAddress} on ${chainName}:`,
          symbol.reason
        )
      }
      return {
        symbol: symbol.status === 'fulfilled' ? symbol.value : undefined,
        name: name.status === 'fulfilled' ? name.value : undefined,
        decimals: decimals.status === 'fulfilled' ? Number(decimals.value) : undefined
      }
    })()
  }
  return tokenInfoCache[cacheKey]
}

export async function getTokenSymbol(
  mpc: MetaportCore,
  chainName: string,
  tokenAddress: string
): Promise<string | undefined> {
  return (await getTokenInfo(mpc, chainName, tokenAddress)).symbol
}

export async function getTokenPrices(
  creditStation: ChainContract | undefined
): Promise<Record<string, bigint> | undefined> {
  if (!creditStation) return
  const supportedTokens = (await creditStation.contract.read.getSupportedTokens()) as string[]
  const prices = (await Promise.all(
    supportedTokens.map((tokenAddress) => creditStation.contract.read.getPrice([tokenAddress]))
  )) as bigint[]
  const priceMap = supportedTokens.reduce(
    (acc, tokenAddress, index) => {
      acc[tokenAddress] = prices[index]
      return acc
    },
    {} as Record<string, bigint>
  )
  return priceMap
}

export interface CreditToken {
  address: types.AddressType
  symbol: string
  name?: string
  decimals: number
  iconUrl?: string
  priceWei: bigint
}

/**
 * Tokens shown in the credit station admin panel. The station contract is the
 * source of truth: every token from getSupportedTokens() is listed first, with
 * metadata taken from the bridge config when the address matches and resolved
 * on-chain otherwise. Bridge-config tokens the station doesn't accept yet are
 * appended as a catalog — setPrice is also the mechanism that adds a token.
 */
export async function getCreditTokens(
  mpc: MetaportCore,
  chainName: string,
  creditStation: ChainContract | undefined
): Promise<CreditToken[]> {
  const tokenPrices = (await getTokenPrices(creditStation)) ?? {}
  const configTokens = mpc.config.connections[chainName]?.erc20 ?? {}
  const tokensMeta = mpc.config.tokens

  const findConfigEntry = (address: string) =>
    Object.entries(configTokens).find(
      ([, data]) => data.address?.toLowerCase() === address.toLowerCase()
    )

  const accepted = await Promise.all(
    Object.entries(tokenPrices).map(async ([address, priceWei]): Promise<CreditToken> => {
      const entry = findConfigEntry(address)
      if (entry) {
        const [symbol, data] = entry
        const meta = tokensMeta[symbol]
        return {
          address: address as types.AddressType,
          symbol,
          name: meta?.name,
          decimals: data.decimals ?? meta?.decimals ?? constants.DEFAULT_ERC20_DECIMALS,
          iconUrl: meta?.iconUrl,
          priceWei
        }
      }
      const info = await getTokenInfo(mpc, chainName, address)
      return {
        address: address as types.AddressType,
        symbol: info.symbol ?? helper.shortAddress(address as types.AddressType),
        name: info.name,
        decimals: info.decimals ?? constants.DEFAULT_ERC20_DECIMALS,
        priceWei
      }
    })
  )

  const acceptedAddresses = new Set(Object.keys(tokenPrices).map((a) => a.toLowerCase()))
  const catalog = Object.entries(configTokens)
    .filter(([, data]) => data.address && !acceptedAddresses.has(data.address.toLowerCase()))
    .map(([symbol, data]): CreditToken => {
      const meta = tokensMeta[symbol]
      return {
        address: data.address as types.AddressType,
        symbol,
        name: meta?.name,
        decimals: data.decimals ?? meta?.decimals ?? constants.DEFAULT_ERC20_DECIMALS,
        iconUrl: meta?.iconUrl,
        priceWei: 0n
      }
    })

  return [...accepted, ...catalog]
}

export async function getTokenPricesBySource(
  creditStations: Record<string, ChainContract>
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
  creditStation: ChainContract,
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
        const rawPayment = await creditStation.contract.read.getPaymentInfo([paymentId])
        return toPayment(paymentId, sourceId, rawPayment as RawPayment, schains)
      })
    )
    results.push(...chunkPayments)
  }
  await fillTimestamps(results, creditStation)
  return results
}

async function fillTimestamps(payments: Payment[], creditStation: ChainContract): Promise<void> {
  const uniqueBlocks = Array.from(new Set(payments.map((p) => p.blockNumber)))
  const timestamps = new Map<number, number>()
  const chunkSize = 10
  for (let i = 0; i < uniqueBlocks.length; i += chunkSize) {
    const chunk = uniqueBlocks.slice(i, i + chunkSize)
    await Promise.all(
      chunk.map(async (blockNumber) => {
        try {
          const block = await creditStation.client.getBlock({ blockNumber: BigInt(blockNumber) })
          if (block) timestamps.set(blockNumber, Number(block.timestamp))
        } catch (error) {
          console.error(`Failed to fetch block ${blockNumber}:`, error)
        }
      })
    )
  }
  for (const payment of payments) {
    payment.timestamp = timestamps.get(payment.blockNumber) ?? 0
  }
}

export async function getPaymentsByAddress(
  creditStation: ChainContract | undefined,
  sourceId: string,
  address: string,
  schains: types.ISChain[]
): Promise<Payment[]> {
  if (!creditStation) return []
  const numberOfPayments = await creditStation.contract.read.getNumberOfPayments([address])
  const paymentIds = (await creditStation.contract.read.getPaymentIds([
    address,
    0n,
    numberOfPayments
  ])) as bigint[]
  return await getPayments(paymentIds, creditStation, sourceId, schains)
}

/** PaymentIdDoesNotExist — ids below the deployment offset revert rather than return. */
function isRevert(error: unknown): boolean {
  return (
    error instanceof BaseError &&
    error.walk((e) => e instanceof ContractFunctionRevertedError) !== null
  )
}

async function getPaymentIfExists(
  creditStation: ChainContract,
  paymentId: bigint,
  sourceId: string,
  schains: types.ISChain[]
): Promise<Payment | null> {
  try {
    const rawPayment = await creditStation.contract.read.getPaymentInfo([paymentId])
    return toPayment(paymentId, sourceId, rawPayment as RawPayment, schains)
  } catch (error) {
    if (isRevert(error)) return null
    throw error
  }
}

export async function getAllPayments(
  creditStation: ChainContract | undefined,
  sourceId: string,
  schains: types.ISChain[]
): Promise<Payment[]> {
  if (!creditStation) return []
  // Payment ids are composite: source prefix in the upper bits, sequential counter
  // in the lower bits. The counter may be seeded with an offset on redeployment,
  // so scan down from the newest id and stop once a whole chunk is missing.
  const lastPaymentId = (await creditStation.contract.read.getLastPaymentId()) as bigint
  const lastSeq = getLedgerPaymentId(lastPaymentId)
  const idPrefix = lastPaymentId - lastSeq

  const payments: Payment[] = []
  const chunkSize = 10n
  for (let high = lastSeq; high > 0n; high -= chunkSize) {
    const low = high > chunkSize ? high - chunkSize : 0n
    const chunk: bigint[] = []
    for (let seq = high; seq > low; seq--) chunk.push(idPrefix + seq)
    const chunkPayments = await Promise.all(
      chunk.map((paymentId) => getPaymentIfExists(creditStation, paymentId, sourceId, schains))
    )
    const existing = chunkPayments.filter((p): p is Payment => p !== null)
    payments.push(...existing)
    if (existing.length === 0) break
  }
  await fillTimestamps(payments, creditStation)
  return payments
}

export async function getPaymentsAcrossSourcesByAddress(
  creditStations: Record<string, ChainContract>,
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
  creditStations: Record<string, ChainContract>,
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
  data: RawPayment,
  schains: types.ISChain[]
): Payment {
  const schainName = schains.find((s) => helper.schainNameToHash(s.name) === data.schainHash)?.name
  return {
    id,
    sourceId,
    schainHash: data.schainHash,
    schainName: schainName || '',
    from: data.from,
    to: data.to,
    blockNumber: Number(data.blockNumber),
    timestamp: 0,
    tokenAddress: data.tokenAddress,
    value: BigInt(data.value ?? 0n)
  }
}
