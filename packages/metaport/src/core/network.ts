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
import { MainnetChain, SChain, TimeoutException } from '@skalenetwork/ima-js'
import { JsonRpcProvider } from 'ethers'

import { WalletClient } from 'viem'
import { holesky } from '@wagmi/core/chains'
import { type UseSwitchChainReturnType } from 'wagmi'

import proxyEndpoints from '../metadata/proxy.json'
import { MAINNET_CHAIN_NAME, DEFAULT_ITERATIONS, DEFAULT_SLEEP } from './constants'
import { IMA_ADDRESSES, IMA_ABIS } from './contracts'
import { SkaleNetwork } from './interfaces'
import { constructWagmiChain } from './wagmi_network'
import { sleep } from './helper'

export { proxyEndpoints as PROXY_ENDPOINTS }

debug.enable('*')
const log = debug('metaport:core:network')

const PROTOCOL: { [protocol in 'http' | 'ws']: string } = {
  http: 'https://',
  ws: 'wss://'
}

export const CHAIN_IDS: { [network in SkaleNetwork]: number } = {
  legacy: 17000,
  regression: 5,
  mainnet: 1,
  testnet: 17000
}

export function isMainnetChainId(chainId: number | BigInt, skaleNetwork: SkaleNetwork): boolean {
  return Number(chainId) === CHAIN_IDS[skaleNetwork]
}

export function getChainEndpoint(
  mainnetEndpoint: string,
  network: SkaleNetwork,
  chainName: string
): string {
  if (chainName === MAINNET_CHAIN_NAME) return mainnetEndpoint
  return getSChainEndpoint(network, chainName)
}

export function getSChainEndpoint(
  network: SkaleNetwork,
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

function getProxyEndpoint(network: SkaleNetwork) {
  return proxyEndpoints[network]
}

export function getMainnetAbi(network: string) {
  if (network === 'legacy') {
    return { ...IMA_ABIS.mainnet, ...IMA_ADDRESSES.legacy }
  }
  if (network === 'regression') {
    return { ...IMA_ABIS.mainnet, ...IMA_ADDRESSES.regression }
  }
  if (network === 'testnet') {
    return { ...IMA_ABIS.mainnet, ...IMA_ADDRESSES.testnet }
  }
  return { ...IMA_ABIS.mainnet, ...IMA_ADDRESSES.mainnet }
}

export function initIMA(
  mainnetEndpoint: string,
  network: SkaleNetwork,
  chainName: string
): MainnetChain | SChain {
  if (chainName === MAINNET_CHAIN_NAME) return initMainnet(mainnetEndpoint, network)
  return initSChain(network, chainName)
}

export function initMainnet(mainnetEndpoint: string, network: string): MainnetChain {
  const provider = new JsonRpcProvider(mainnetEndpoint)
  return new MainnetChain(provider, getMainnetAbi(network))
}

export function initSChain(network: SkaleNetwork, chainName: string): SChain {
  const endpoint = getChainEndpoint(null, network, chainName)
  const provider = new JsonRpcProvider(endpoint)
  return new SChain(provider, IMA_ABIS.schain)
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
  skaleNetwork: SkaleNetwork,
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
