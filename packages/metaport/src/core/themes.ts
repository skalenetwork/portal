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
 * @file themes.ts
 * @copyright SKALE Labs 2022-Present
 */

import { dc, types } from '@/core'
import { DEFAULT_MP_Z_INDEX } from './constants'

const defaultThemes = {
  dark: {
    primary: '#29FF94',
    background: '#000000',
    mode: 'dark',
    position: dc.Positions.bottomRight,
    zIndex: DEFAULT_MP_Z_INDEX
  },
  light: {
    primary: '#173CFF',
    background: '#EFEFEF',
    mode: 'light',
    position: dc.Positions.bottomRight,
    zIndex: DEFAULT_MP_Z_INDEX
  }
}

// warning: order is important here
const MUI_ELEMENTS = [
  'mobileStepper',
  'fab',
  'speedDial',
  'appBar',
  'drawer',
  'modal',
  'snackbar',
  'tooltip'
]

const INDEX_STEP = 50

export function getWidgetTheme(theme: types.mp.Theme | null | undefined): types.mp.Theme {
  if (!theme) return defaultThemes.dark as types.mp.Theme
  if (theme.mode && Object.keys(theme).length === 1) {
    return defaultThemes[theme.mode] as types.mp.Theme
  }
  if (theme.position === undefined) theme.position = dc.Positions.bottomRight
  if (theme.zIndex === undefined) theme.zIndex = DEFAULT_MP_Z_INDEX
  if (theme.background === undefined) theme.background = defaultThemes[theme.mode].background
  if (theme.primary === undefined) theme.primary = defaultThemes[theme.mode].primary
  return theme
}

export function getMuiZIndex(theme: types.mp.Theme): object {
  return MUI_ELEMENTS.reduce((x, y, i) => ((x[y] = theme.zIndex + (i + 1) * INDEX_STEP), x), {})
}
