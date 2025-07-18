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

import { Helmet } from 'react-helmet'

import { MetaportProvider, getMetaportTheme } from '@skalenetwork/metaport'
import '@skalenetwork/metaport/dist/style.css'

import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles'

import Portal from './Portal'

import { METAPORT_CONFIG } from './data/metaportConfig'
import { createMuiTheme } from './core/themes'

import { META_TAGS } from './core/meta'
import { AuthProvider } from './AuthContext'
import { LikedAppsProvider } from './LikedAppsContext'
import StatsigWrapper from './providers/StatsigProvider'

METAPORT_CONFIG.mainnetEndpoint = import.meta.env.VITE_MAINNET_ENDPOINT
METAPORT_CONFIG.projectId = import.meta.env.VITE_WC_PROJECT_ID

const mpTheme = getMetaportTheme(METAPORT_CONFIG.theme)
const muiTheme = createMuiTheme(mpTheme)
const isDarkMode = mpTheme.mode === 'dark'

export default function App() {
  return (
    <div
      className={'bridge ' + (isDarkMode ? 'bridge-dark' : 'bridge-light')}
      style={{ background: mpTheme.background }}
    >
      <Helmet>
        <title>{META_TAGS.main.title}</title>
        <meta name="description" content={META_TAGS.main.description} />
        <meta property="og:title" content={META_TAGS.main.title} />
        <meta property="og:description" content={META_TAGS.main.description} />
      </Helmet>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={muiTheme}>
          <StatsigWrapper>
            <MetaportProvider config={METAPORT_CONFIG}>
              <AuthProvider>
                <LikedAppsProvider>
                  <Portal />
                </LikedAppsProvider>
              </AuthProvider>
            </MetaportProvider>
          </StatsigWrapper>
        </ThemeProvider>
      </StyledEngineProvider>
    </div>
  )
}
