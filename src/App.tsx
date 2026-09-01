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
 * @file App.tsx
 * @copyright SKALE Labs 2023-Present
 */

import { MetaportProvider, getMetaportTheme, useThemeMode } from '@/bridge'
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles'
import { Toaster, type ToasterProps } from 'sonner'

import Portal from './Portal'

import { METAPORT_CONFIG } from './data/metaportConfig'
import { createMuiTheme } from '@/lib/themes'


METAPORT_CONFIG.mainnetEndpoint = import.meta.env.VITE_MAINNET_ENDPOINT
METAPORT_CONFIG.projectId = import.meta.env.VITE_WC_PROJECT_ID

const mpTheme = getMetaportTheme(METAPORT_CONFIG.theme)
const muiTheme = createMuiTheme(mpTheme)

function ThemedToaster(props: Omit<ToasterProps, 'theme'>) {
  const { mode } = useThemeMode()
  return <Toaster theme={mode} {...props} />
}
export default function App() {
  return (
    <div className="min-h-screen">
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={muiTheme}>
          <MetaportProvider config={METAPORT_CONFIG}>
            <div className="app-shell">
              <Portal />
            </div>
          </MetaportProvider>
        </ThemeProvider>
      </StyledEngineProvider>
      <ThemedToaster
        position="bottom-right"
        richColors
        closeButton
        toastOptions={{ style: { borderRadius: '20px' } }}
      />
    </div>
  )
}
