/**
 * @license
 * SKALE bridge-ui
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

import './App.scss';

import { MetaportProvider, getMetaportTheme } from '@skalenetwork/metaport';
import '@skalenetwork/metaport/dist/style.css'

import { StyledEngineProvider } from '@mui/material/styles'
import { ThemeProvider } from '@mui/material/styles'

import Bridge from './Bridge';

import { METAPORT_CONFIG } from './metadata/metaportConfig';
import { createMuiTheme } from './core/themes';

METAPORT_CONFIG.mainnetEndpoint = import.meta.env.VITE_MAINNET_ENDPOINT;

const mpTheme = getMetaportTheme(METAPORT_CONFIG.theme);
const muiTheme = createMuiTheme(mpTheme);
const isDarkMode = mpTheme.mode === 'dark';

export default function App() {
  return (
    <div className={'bridge ' + (isDarkMode ? 'bridge-dark' : 'bridge-light')} style={{ background: mpTheme.background }}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={muiTheme}>
          <MetaportProvider config={METAPORT_CONFIG}>
            <Bridge />
          </MetaportProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </div>
  )
}
