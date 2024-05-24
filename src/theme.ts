import { createContext } from 'react'
import { type PaletteMode } from '@mui/material'

export const ColorModeContext = createContext({ toggleColorMode: () => {} })

export const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    primary: {
      main: '#1DB954'
    },
    secondary: {
      main: '#30BCED'
    },
    ...(mode === 'light'
      ? {
          // palette values for light mode
          background: {
            default: '#FFFFFA',
            paper: '#FFFFFA'
          }
        }
      : {
          // palette values for dark mode
          background: {
            default: '#202030',
            paper: '#202030'
          }
        })
  }
})
