import { type PaletteMode } from '@mui/material'
import { createTheme, type Theme } from '@mui/material/styles'
import { type interfaces } from '@skalenetwork/metaport'

export function createMuiTheme(mpTheme: interfaces.MetaportTheme): Theme {
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
