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

import debug from 'debug'
import { JsonRpcProvider, Provider } from 'ethers'
import { types } from '@/core'

import { WalletClient } from 'viem'
import { holesky } from '@wagmi/core/chains'
import { type UseSwitchChainReturnType } from 'wagmi'

import proxyEndpoints from '../metadata/proxy.json'
import { MAINNET_CHAIN_NAME, DEFAULT_ITERATIONS, DEFAULT_SLEEP } from './constants'
import { constructWagmiChain } from './wagmi_network'
import { TimeoutException } from './exceptions'
import { sleep } from './helper'

export { proxyEndpoints as PROXY_ENDPOINTS }

debug.enable('*')
const log = debug('metaport:core:network')

const PROTOCOL: { [protocol in 'http' | 'ws']: string } = {
  http: 'https://',
  ws: 'wss://'
}

export const CHAIN_IDS: { [network in types.SkaleNetwork]: number } = {
  legacy: 17000,
  regression: 5,
  mainnet: 1,
  testnet: 17000
}

export function isMainnetChainId(chainId: number | BigInt, skaleNetwork: types.SkaleNetwork): boolean {
  return Number(chainId) === CHAIN_IDS[skaleNetwork]
}

export function getEndpoint(
  mainnetEndpoint: string,
  network: types.SkaleNetwork,
  chainName: string
): string {
  if (chainName === MAINNET_CHAIN_NAME) return mainnetEndpoint
  return getSChainEndpoint(network, chainName)
}

export function getSChainEndpoint(
  network: types.SkaleNetwork,
  sChainName: string,
  protocol: 'http' | 'ws' = 'http'
): string {
  return (
    PROTOCOL[protocol] +
    getProxyEndpoint(network) +
    '/v1/' +
    (protocol === 'ws' ? 'ws/' : '') +
    sChainName
  )
}

function getProxyEndpoint(network: types.SkaleNetwork) {
  return proxyEndpoints[network]
}

export function mainnetProvider(mainnetEndpoint: string): Provider {
  return new JsonRpcProvider(mainnetEndpoint)
}

export function sChainProvider(network: types.SkaleNetwork, chainName: string): Provider {
  const endpoint = getEndpoint(null, network, chainName)
  return new JsonRpcProvider(endpoint)
}

async function waitForNetworkChange(
  walletClient: WalletClient,
  initialChainId: number | bigint,
  requiredChainId: number | bigint,
  sleepInterval: number = DEFAULT_SLEEP,
  iterations: number = DEFAULT_ITERATIONS
): Promise<void> {
  const logData = `${initialChainId} -> ${requiredChainId}, sleep ${sleepInterval}ms`
  for (let i = 1; i <= iterations; i++) {
    const chainId = await walletClient.getChainId()
    if (BigInt(chainId) === BigInt(requiredChainId)) {
      return
    }
    log(`🔎 ${i}/${iterations} Waiting for network change - ${logData}`)
    await sleep(sleepInterval)
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
  log(
    `Current chainId: ${currentChainId}, required chainId: ${chainId}, required network: ${chainName} `
  )
  log(`Switching network to ${chainId}...`)
  try {
    if (chainId !== 1n && chainId !== 5n && chainId !== 17000n) {
      await walletClient.addChain({ chain: constructWagmiChain(skaleNetwork, chainName) })
    }
    if (chainId === 17000n) {
      await walletClient.addChain({ chain: holesky })
    }
  } catch {
    log('Failed to add chain or chain already added')
  }
  try {
    // tmp fix for coinbase wallet
    _networkSwitch(chainId, currentChainId, switchChain)
  } catch (e) {
    log('Failed to switch network, retrying...')
    await sleep(DEFAULT_SLEEP)
    _networkSwitch(chainId, currentChainId, switchChain)
  }
  await waitForNetworkChange(walletClient, currentChainId, chainId)
  await sleep(DEFAULT_SLEEP)
  log(`Network switched to ${chainId}`)
  return chainId
}
