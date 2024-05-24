import { useMemo, useState, StrictMode } from 'react'
import { type PaletteMode, CssBaseline, createTheme, ThemeProvider } from '@mui/material'
import { Main } from './components/Main'
import { ColorModeContext, getDesignTokens } from './theme'

export const App = () => {
  const [mode, setMode] = useState<PaletteMode>('light')

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
      }
    }),
    []
  )

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode])

  return (
    <StrictMode>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Main />
        </ThemeProvider>
      </ColorModeContext.Provider>
    </StrictMode>
  )
}
