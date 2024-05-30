import type {} from '@mui/material/themeCssVarsAugmentation'
import { experimental_extendTheme as extendTheme } from '@mui/material'

declare module '@mui/material/styles' {
  interface PaletteOptions {
    gradient: string
  }
}

export const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#1DB954',
          contrastText: '#FFFFFF'
        },
        secondary: {
          main: '#30BCED',
          contrastText: '#FFFFFF'
        },
        background: {
          default: '#F2F2F2',
          paper: '#FFFFFA'
        },
        gradient: 'linear-gradient(-60deg, #eeecff 50%, #9e9db1 50%)'
      }
    },
    dark: {
      palette: {
        primary: {
          main: '#1DB954',
          contrastText: '#FFFFFF'
        },
        secondary: {
          main: '#30BCED',
          contrastText: '#FFFFFF'
        },
        background: {
          default: '#202030',
          paper: '#202030'
        },
        gradient: 'linear-gradient(-60deg, #616073 50%, #414153 50%)'
      }
    }
  }
})
