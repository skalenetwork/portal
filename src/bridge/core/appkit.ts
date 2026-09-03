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
 * @file appkit.ts
 * @copyright SKALE Labs 2026-Present
 */

import type { AppKit, CreateAppKit, Views } from '@reown/appkit/react'
import type { AppKitNetwork } from '@reown/appkit/networks'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { http, type Config } from 'wagmi'
import { mainnet, goerli, hoodi, base, baseSepolia } from 'wagmi/chains'

import { types } from '@/core'
import { constructWagmiChain } from './wagmi_network'
import { getOverlayZIndex } from './themes'

const TERMS_URL = 'https://portal.skale.space/other/terms-of-service'

let options: CreateAppKit | undefined
let modal: Promise<AppKit> | undefined

export function createWallet(config: types.mp.Config, theme: types.mp.Theme): Config {
  const networks = [
    mainnet,
    goerli,
    hoodi,
    base,
    baseSepolia,
    ...config.chains.map((chain) => constructWagmiChain(config.skaleNetwork, chain))
  ] as [AppKitNetwork, ...AppKitNetwork[]]

  const adapter = new WagmiAdapter({
    networks,
    projectId: config.projectId as string,
    transports: Object.fromEntries(
      networks.map((chain) => [chain.id, http(chain.rpcUrls.default.http[0])])
    )
  })

  options = {
    adapters: [adapter],
    networks,
    projectId: config.projectId as string,
    termsConditionsUrl: TERMS_URL,
    themeMode: theme.mode as 'light' | 'dark',
    themeVariables: { '--w3m-z-index': getOverlayZIndex(theme) },
    metadata: {
      name: 'SKALE Portal',
      description: 'The Entry Point to the SKALE Blockchain',
      url: 'https://portal.skale.space',
      icons: ['https://portal.skale.space/favicon.ico']
    },
    features: {
      analytics: false,
      email: false,
      socials: false,
      swaps: false,
      onramp: false,
      send: false,
      receive: false,
      history: false
    }
  }
  modal = undefined
  return adapter.wagmiConfig
}

export function openWallet(view?: Views): Promise<unknown> {
  modal ??= import('@reown/appkit/react').then(({ createAppKit }) => createAppKit(options!))
  return modal.then((appKit) => appKit.open(view ? { view } : undefined))
}

export function setWalletTheme(themeMode: 'light' | 'dark'): void {
  if (options) options.themeMode = themeMode
  modal?.then((appKit) => appKit.setThemeMode(themeMode))
}
