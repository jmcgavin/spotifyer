import { StrictMode, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import styled from '@emotion/styled'
import { Box, CssBaseline } from '@mui/material'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'

import { LocalFileMetadata } from './types'
import { theme } from './theme'
import { ROUTES } from './constants'
import { Footer, Header } from './components'
import { Callback, Login, SearchResults, TrackSelection } from './pages'
import { SpotifyUser } from './api'

const StyledMain = styled.main`
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
`

export const App = () => {
  const [user, setUser] = useState<SpotifyUser>()
  const [data, setData] = useState<LocalFileMetadata[]>([])

  return (
    // <StrictMode>
    <CssVarsProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Box
          sx={{
            minHeight: '100vh',
            padding: '16px 24px',
            display: 'grid',
            gridTemplateRows: 'min-content 1fr min-content',
            gap: '48px'
          }}
        >
          <Header />
          <StyledMain>
            <Routes>
              <Route path={ROUTES.ROOT} element={<Login />} />
              <Route path={ROUTES.CALLBACK} element={<Callback user={user} setUser={setUser}/>} />
              <Route
                path={ROUTES.TRACK_SELECTION}
                element={<TrackSelection data={data} onSetData={setData} />}
              />
              <Route path={ROUTES.SEARCH_RESULTS} element={<SearchResults data={data} user={user} />} />
            </Routes>
          </StyledMain>
          <Footer />
        </Box>
      </BrowserRouter>
    </CssVarsProvider>
    // </StrictMode>
  )
}
