import { type types } from '@/core'
import { type PaletteMode } from '@mui/material'
import { createTheme, type Theme } from '@mui/material/styles'

export function createMuiTheme(mpTheme: types.mp.Theme): Theme {
  return createTheme({
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
