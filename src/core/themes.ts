import { PaletteMode } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { interfaces, getMetaportTheme } from '@skalenetwork/metaport';


export function createMuiTheme(mpTheme: interfaces.MetaportTheme) {
    return createTheme({
        palette: {
            mode: mpTheme.mode as PaletteMode,
            background: {
                paper: mpTheme.background
            },
            primary: {
                main: mpTheme.primary ?? '',
            },
            secondary: {
                main: mpTheme.background ?? '',
            }
        }
    })
}