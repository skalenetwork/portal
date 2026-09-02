import { type types } from '@/core'
import { type PaletteMode } from '@mui/material'
import { createTheme, type Theme } from '@mui/material/styles'
import { getMuiZIndex } from '@/bridge'

export function createMuiTheme(mpTheme: types.mp.Theme): Theme {
  return createTheme({
    zIndex: getMuiZIndex(mpTheme),
    palette: {
      mode: mpTheme.mode as PaletteMode,
      background: {
        paper: mpTheme.background
      },
      primary: {
        main: mpTheme.primary ?? ''
      },
      secondary: {
        main: mpTheme.background ?? ''
      }
    }
  })
}
