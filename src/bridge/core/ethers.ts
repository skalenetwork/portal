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
 * @file ethers.ts
 * @copyright SKALE Labs 2024-Present
 */

import * as React from 'react'

import {
  type UseWalletClientReturnType,
  useWalletClient,
  usePublicClient,
  type UsePublicClientReturnType
} from 'wagmi'
import { BrowserProvider, JsonRpcSigner, Eip1193Provider } from 'ethers'

import { FallbackProvider, JsonRpcProvider } from 'ethers'
import { type HttpTransport } from 'viem'

export function walletClientToSigner(walletClient: UseWalletClientReturnType['data']) {
  const { account, transport } = walletClient
  const provider = new BrowserProvider(transport as Eip1193Provider, 'any')
  const signer = new JsonRpcSigner(provider, account.address)
  return signer
}

/** Hook to convert a viem Wallet Client to an ethers.js Signer. */
export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { data: walletClient } = useWalletClient({ chainId })
  return React.useMemo(
    () => (walletClient ? walletClientToSigner(walletClient) : undefined),
    [walletClient]
  )
}

export function publicClientToProvider(publicClient: UsePublicClientReturnType) {
  const { chain, transport } = publicClient
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address
  }
  if (transport.type === 'fallback') {
    const providers = (transport.transports as ReturnType<HttpTransport>[]).map(
      ({ value }) => new JsonRpcProvider(value?.url, network)
    )
    if (providers.length === 1) return providers[0]
    return new FallbackProvider(providers)
  }
  return new JsonRpcProvider(transport.url, network)
}

/** Hook to convert a viem Public Client to an ethers.js Provider. */
export function useEthersProvider({ chainId }: { chainId?: number } = {}) {
  const publicClient = usePublicClient({ chainId })
  return React.useMemo(() => publicClientToProvider(publicClient), [publicClient])
}
