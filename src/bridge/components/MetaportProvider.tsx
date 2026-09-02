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
 * @file MetaportProvider.tsx
 * @copyright SKALE Labs 2023-Present
 */

import { useEffect, useMemo, type ReactElement } from 'react'

import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { PaletteMode } from '@mui/material'
import { StyledEngineProvider, createTheme, ThemeProvider } from '@mui/material/styles'

import { types } from '@/core'

import { getWidgetTheme, getMuiZIndex } from '../core/themes'
import { styles } from '../core/css'
import { useUIStore } from '../store/Store'
import { useMetaportStore } from '../store/MetaportStore'
import MetaportCore from '../core/metaport'
import { createWallet, setWalletTheme } from '../core/appkit'

const queryClient = new QueryClient()

export default function MetaportProvider(props: {
  config: types.mp.Config
  className?: string
  children?: ReactElement | ReactElement[]
}) {
  const setTheme = useUIStore((state) => state.setTheme)
  const setMpc = useMetaportStore((state) => state.setMpc)
  const addTransaction = useMetaportStore((state) => state.addTransaction)
  const setOpen = useUIStore((state) => state.setOpen)
  const metaportTheme = useUIStore((state) => state.theme)

  const widgetTheme = getWidgetTheme(props.config.theme)

  const wagmiConfig = useMemo(
    () => createWallet(props.config, widgetTheme),
    [props.config.skaleNetwork, props.config.projectId, props.config.chains.join(',')]
  )

  const theme = useMemo(() => {
    const disabledInputColor = 'color-mix(in srgb, var(--color-foreground) 50%, transparent)'
    return createTheme({
      zIndex: getMuiZIndex(widgetTheme),
      palette: {
        mode: widgetTheme.mode as PaletteMode,
        background: { paper: widgetTheme.background },
        primary: { main: widgetTheme.primary },
        secondary: { main: widgetTheme.background }
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
  }, [widgetTheme.mode, widgetTheme.background, widgetTheme.primary, widgetTheme.zIndex])

  function actionStateUpdated(e: CustomEvent) {
    const actionStateUpdate: types.mp.ActionStateUpdate = e.detail
    if (!actionStateUpdate.transactionHash) return
    const done =
      actionStateUpdate.actionState === 'unlockDone' ||
      actionStateUpdate.actionState === 'unwrapDone'
    addTransaction({
      transactionHash: actionStateUpdate.transactionHash,
      timestamp: actionStateUpdate.timestamp,
      chainName: done
        ? actionStateUpdate.actionData.chainName2
        : actionStateUpdate.actionData.chainName1,
      txName: actionStateUpdate.actionState
    })
  }

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

  useEffect(() => {
    setWalletTheme(widgetTheme.mode as 'light' | 'dark')
  }, [widgetTheme.mode])

  if (!metaportTheme) return null

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <div className={styles.metaport}>{props.children}</div>
          </ThemeProvider>
        </StyledEngineProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
