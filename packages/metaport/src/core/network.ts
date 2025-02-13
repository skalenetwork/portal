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
import { holesky } from '@wagmi/core/chains'
import { type UseSwitchChainReturnType } from 'wagmi'

import { constructWagmiChain } from './wagmi_network'
import { TimeoutException } from './exceptions'

const log = new Logger<ILogObj>({ name: 'metaport:core:network' })

export const CHAIN_IDS: { [network in types.SkaleNetwork]: number } = {
  legacy: 17000,
  regression: 5,
  mainnet: 1,
  testnet: 17000
}

export function isMainnetChainId(
  chainId: number | BigInt,
  skaleNetwork: types.SkaleNetwork
): boolean {
  return Number(chainId) === CHAIN_IDS[skaleNetwork]
}

export function mainnetProvider(mainnetEndpoint: string): Provider {
  return new JsonRpcProvider(mainnetEndpoint)
}

export function sChainProvider(network: types.SkaleNetwork, chainName: string): Provider {
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
    if (chainId !== 1n && chainId !== 5n && chainId !== 17000n) {
      await walletClient.addChain({ chain: constructWagmiChain(skaleNetwork, chainName) })
    }
    if (chainId === 17000n) {
      await walletClient.addChain({ chain: holesky })
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
