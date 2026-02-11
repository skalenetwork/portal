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
 * @file MetaportProvider.ts
 * @copyright SKALE Labs 2023-Present
 */

import { ReactElement, useEffect } from 'react'

import {
  RainbowKitProvider,
  darkTheme,
  lightTheme,
  connectorsForWallets,
  DisclaimerComponent
} from '@rainbow-me/rainbowkit'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { mainnet, goerli, hoodi, base, baseSepolia } from 'wagmi/chains'
import { GetChainsReturnType } from '@wagmi/core'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PaletteMode } from '@mui/material'

import {
  injectedWallet,
  metaMaskWallet,
  enkryptWallet,
  coinbaseWallet,
  rainbowWallet,
  rabbyWallet
} from '@rainbow-me/rainbowkit/wallets'

import { types } from '@/core'

import { StyledEngineProvider } from '@mui/material/styles'
import { createTheme, ThemeProvider } from '@mui/material/styles'

import '@rainbow-me/rainbowkit/styles.css'

import { constructWagmiChain } from '../core/wagmi_network'

import { getWidgetTheme, getMuiZIndex } from '../core/themes'

import { styles } from '../core/css'

import { useUIStore } from '../store/Store'
import { useMetaportStore } from '../store/MetaportStore'
import MetaportCore from '../core/metaport'

export default function MetaportProvider(props: {
  config: types.mp.Config
  className?: string
  children?: ReactElement | ReactElement[]
}) {
  const skaleChains = props.config.chains.map((chain) =>
    constructWagmiChain(props.config.skaleNetwork, chain)
  )

  const connectors = connectorsForWallets(
    [
      {
        groupName: 'Recommended wallets',
        wallets: [
          enkryptWallet,
          injectedWallet,
          metaMaskWallet,
          coinbaseWallet,
          rainbowWallet,
          rabbyWallet
        ]
      }
    ],
    {
      appName: 'SKALE Metaport',
      projectId: props.config.projectId
    }
  )

  const chains: GetChainsReturnType = [mainnet, goerli, hoodi, ...skaleChains]
  const wagmiConfig = createConfig({
    chains,
    connectors,
    transports: {
      [mainnet.id]: http(),
      [goerli.id]: http(),
      [hoodi.id]: http(),
      [base.id]: http(),
      [baseSepolia.id]: http(),
      ...Object.fromEntries(
        skaleChains.map((chain) => [chain.id, http(chain.rpcUrls.default.http[0])])
      )
    }
  })

  const widgetTheme = getWidgetTheme(props.config.theme)

  const setTheme = useUIStore((state) => state.setTheme)
  const setMpc = useMetaportStore((state) => state.setMpc)
  const addTransaction = useMetaportStore((state) => state.addTransaction)
  const setOpen = useUIStore((state) => state.setOpen)
  const metaportTheme = useUIStore((state) => state.theme)

  useEffect(() => {
    setOpen(props.config.openOnLoad)
    window.addEventListener('metaport_actionStateUpdated', actionStateUpdated as EventListener)
    return () => {
      window.removeEventListener('metaport_actionStateUpdated', actionStateUpdated as EventListener)
    }
  }, [])

  useEffect(() => {
    setTheme(widgetTheme)
  }, [setTheme])

  useEffect(() => {
    setMpc(new MetaportCore(props.config))
  }, [setMpc])

  function actionStateUpdated(e: CustomEvent) {
    const actionStateUpdate: types.mp.ActionStateUpdate = e.detail
    if (actionStateUpdate.transactionHash) {
      let chainName = actionStateUpdate.actionData.chainName1
      if (
        actionStateUpdate.actionState === 'unlockDone' ||
        actionStateUpdate.actionState === 'unwrapDone'
      ) {
        chainName = actionStateUpdate.actionData.chainName2
      }
      addTransaction({
        transactionHash: actionStateUpdate.transactionHash,
        timestamp: actionStateUpdate.timestamp,
        chainName,
        txName: actionStateUpdate.actionState
      })
    }
  }

  const disabledInputColor = 'color-mix(in srgb, var(--color-foreground) 50%, transparent)'

  let theme = createTheme({
    zIndex: getMuiZIndex(widgetTheme),
    palette: {
      mode: widgetTheme.mode as PaletteMode,
      background: {
        paper: widgetTheme.background
      },
      primary: {
        main: widgetTheme.primary
      },
      secondary: {
        main: widgetTheme.background
      }
    },
    components: {
      MuiInputBase: {
        styleOverrides: {
          input: {
            '&.Mui-disabled': {
              color: disabledInputColor,
              WebkitTextFillColor: disabledInputColor
            }
          }
        }
      }
    }
  })

  if (!metaportTheme) return <div></div>

  const queryClient = new QueryClient()

  const Disclaimer: DisclaimerComponent = ({ Text, Link }) => (
    <Text>
      <h3 className="p-0, m-0">SKALE Portal Terms of Use</h3>
      By connecting your wallet, you agree to the{' '}
      <Link href="https://portal.skale.space/other/terms-of-service">Terms of Service</Link> and
      acknowledge you have read and understand them. These are subject to change.
    </Text>
  )

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          appInfo={{
            disclaimer: Disclaimer,
            appName: 'SKALE Metaport',
            learnMoreUrl: 'https://portal.skale.space/other/faq'
          }}
          showRecentTransactions={true}
          theme={widgetTheme.mode === 'dark' ? darkTheme() : lightTheme()}
        >
          <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
              <div className={styles.metaport}>{props.children}</div>
            </ThemeProvider>
          </StyledEngineProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
