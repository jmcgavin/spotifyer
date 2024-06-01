import styled from '@emotion/styled'
import { Dispatch, SetStateAction, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box } from '@mui/material'

import { type SpotifyUser, getUser, requestAccessToken } from '../../api'

import { LOCALSTORAGE_KEYS, ROUTES } from '../../constants'
import { useLocalStorage } from '../../hooks'

const Container = styled(Box)`
  display: flex;
  height: 100%;
  justify-content: center;
`

const StyledHeader = styled.h1`
  align-self: center;
  justify-content: center;
  opacity: 0;
  cursor: default;
  user-select: none;
  animation: fadeIn 5s;

  & > span {
    color: var(--mui-palette-primary-main);
  }

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    10% {
      opacity: 0;
    }
    30% {
      opacity: 100;
    }
    90% {
      opacity: 100;
    }
    100% {
      opacity: 0;
    }
  }
`

type Props = {
  user: SpotifyUser | undefined,
  setUser: Dispatch<SetStateAction<SpotifyUser | undefined>>
}

export const Callback = ({ user, setUser }: Props) => {
  const [accessToken] = useLocalStorage(LOCALSTORAGE_KEYS.SPOTIFY_ACCESS_TOKEN, '')
  const navigate = useNavigate()

  useEffect(() => {
    const authorizationCode = new URLSearchParams(window.location.search).get('code')
    if (authorizationCode) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      (async () => {
        const accessToken = await requestAccessToken(authorizationCode)
        const user = await getUser(accessToken)
        setUser(user)
      })()
    } else {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      (async () => {
        const user = await getUser(accessToken)
        setUser(user)
      })()
    }
    setTimeout(() => navigate(ROUTES.TRACK_SELECTION, { replace: true }), 5500)
  }, [accessToken, navigate, setUser])

  return (
    <Container>
      {user && (
        <StyledHeader>
          Hello <span>{user.display_name}</span>.
        </StyledHeader>
      )}
    </Container>
  )
}
