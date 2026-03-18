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
 * @file network.ts
 * @copyright SKALE Labs 2023-Present
 */

import { Logger, type ILogObj } from 'tslog'
import { JsonRpcProvider, Provider } from 'ethers'
import { type types, constants, endpoints, helper } from '@/core'

import { WalletClient } from 'viem'
import { type UseSwitchChainReturnType } from 'wagmi'
import {
  mainnet,
  hoodi,
  holesky,
  base,
  baseSepolia,
  arbitrum,
  polygon,
  optimism,
  avalanche,
  bsc,
  monad,
  gnosis,
  Chain
} from 'wagmi/chains'

import { constructWagmiChain } from './wagmi_network'
import { TimeoutException } from './exceptions'

const log = new Logger<ILogObj>({ name: 'metaport:core:network' })

export const EXT_PREFIX = 'ext-'

export const EXT_CHAIN_RPC_OVERRIDES: Record<string, string> = {
  polygon: 'https://polygon-bor-rpc.publicnode.com'
}

export function extChainRpcUrl(chainName: string): string {
  const name = getExtChainName(chainName)
  const override = EXT_CHAIN_RPC_OVERRIDES[name]
  if (override) return override
  return EXT_CHAINS[name].rpcUrls.default.http[0]
}

export const EXT_CHAINS: Record<string, Chain> = {
  arbitrum,
  polygon,
  'op-mainnet': optimism,
  avalanche,
  bsc,
  monad,
  gnosis
}

export function isExtChain(chainName: string): boolean {
  return chainName.startsWith(EXT_PREFIX)
}

export function getExtChainName(chainName: string): string {
  return chainName.slice(EXT_PREFIX.length)
}

export function getExtChain(chainName: string): Chain {
  const name = getExtChainName(chainName)
  const chain = EXT_CHAINS[name]
  if (!chain) throw new Error(`Unknown ext chain: ${chainName}`)
  return chain
}

export const MAINNET_CHAINS = [mainnet, hoodi, holesky, base, baseSepolia]
export const NETWORK_MAINNET_CHAINS: { [network in types.SkaleNetwork]: Chain } = {
  mainnet: mainnet,
  testnet: hoodi,
  regression: hoodi,
  legacy: hoodi,
  base: base,
  'base-sepolia-testnet': baseSepolia
}

export function isMainnetChainId(
  chainId: number | BigInt,
  skaleNetwork: types.SkaleNetwork
): boolean {
  return Number(chainId) === NETWORK_MAINNET_CHAINS[skaleNetwork].id
}

const _chainIdToName: Record<number, string> = (() => {
  const map: Record<number, string> = {}
  for (const chain of MAINNET_CHAINS) map[chain.id] = constants.MAINNET_CHAIN_NAME
  for (const [key, chain] of Object.entries(EXT_CHAINS)) map[chain.id] = `${EXT_PREFIX}${key}`
  return map
})()

export function chainIdToName(chainId: number): string {
  return _chainIdToName[chainId] ?? constants.MAINNET_CHAIN_NAME
}

export function mainnetProvider(mainnetEndpoint: string): Provider {
  return new JsonRpcProvider(mainnetEndpoint)
}

export function sChainProvider(network: types.SkaleNetwork, chainName: string): Provider {
  if (isExtChain(chainName)) {
    return new JsonRpcProvider(extChainRpcUrl(chainName))
  }
  const endpoint = endpoints.get(null, network, chainName)
  return new JsonRpcProvider(endpoint)
}

async function waitForNetworkChange(
  walletClient: WalletClient,
  initialChainId: number | bigint,
  requiredChainId: number | bigint,
  sleepInterval: number = constants.DEFAULT_SLEEP,
  iterations: number = constants.DEFAULT_ITERATIONS
): Promise<void> {
  const logData = `${initialChainId} -> ${requiredChainId}, sleep ${sleepInterval}ms`
  for (let i = 1; i <= iterations; i++) {
    const chainId = await walletClient.getChainId()
    if (BigInt(chainId) === BigInt(requiredChainId)) {
      return
    }
    log.info(`🔎 ${i}/${iterations} Waiting for network change - ${logData}`)
    await helper.sleep(sleepInterval)
  }
  throw new TimeoutException('waitForNetworkChange timeout - ' + logData)
}

async function _networkSwitch(
  chainId: number | bigint,
  currentChainId: number | bigint,
  switchChain: UseSwitchChainReturnType['switchChainAsync']
): Promise<void> {
  const chain = await switchChain({ chainId: Number(chainId) })
  if (!chain) {
    throw new Error(`Failed to switch from ${currentChainId} to ${chainId} `)
  }
}

export async function enforceNetwork(
  chainId: bigint,
  walletClient: WalletClient,
  switchChain: UseSwitchChainReturnType['switchChainAsync'],
  skaleNetwork: types.SkaleNetwork,
  chainName: string
): Promise<bigint> {
  const currentChainId = await walletClient.getChainId()
  log.info(
    `Current chainId: ${currentChainId}, required chainId: ${chainId}, required network: ${chainName} `
  )
  log.info(`Switching network to ${chainId}...`)
  try {
    if (isExtChain(chainName)) {
      await walletClient.addChain({ chain: getExtChain(chainName) })
    } else if (isMainnetChainId(chainId, skaleNetwork)) {
      await walletClient.addChain({ chain: NETWORK_MAINNET_CHAINS[skaleNetwork] })
    } else {
      await walletClient.addChain({ chain: constructWagmiChain(skaleNetwork, chainName) })
    }
  } catch {
    log.info('Failed to add chain or chain already added')
  }
  try {
    // tmp fix for coinbase wallet
    _networkSwitch(chainId, currentChainId, switchChain)
  } catch (e) {
    log.info('Failed to switch network, retrying...')
    await helper.sleep(constants.DEFAULT_SLEEP)
    _networkSwitch(chainId, currentChainId, switchChain)
  }
  await waitForNetworkChange(walletClient, currentChainId, chainId)
  await helper.sleep(constants.DEFAULT_SLEEP)
  log.info(`Network switched to ${chainId}`)
  return chainId
}
