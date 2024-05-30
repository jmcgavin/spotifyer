import { useNavigate } from 'react-router-dom'
import styled from '@emotion/styled'
import { Box, Button } from '@mui/material'
import { Lock } from '@mui/icons-material'

import { refreshAccessToken, requestAuthorization } from '../../api'

import { ROUTES } from '../../constants'

const Container = styled(Box)`
  display: flex;
  height: 100%;
  justify-content: center;
`

const StyledBackground = styled.div`
  animation: slide 20s ease-in-out infinite alternate;
  background-image: var(--mui-palette-gradient);
  bottom: 0;
  left: -50%;
  opacity: 0.2;
  position: fixed;
  right: -50%;
  top: 0;
  z-index: -1;

  @keyframes slide {
    0% {
      transform: translateX(-25%);
    }
    100% {
      transform: translateX(25%);
    }
  }
`

const AnimatedBg = () => {
  return (
    <>
      <StyledBackground />
      <StyledBackground
        style={{ animationDirection: 'alternate-reverse', animationDuration: '30s' }}
      />
      <StyledBackground style={{ animationDuration: '40s' }} />
    </>
  )
}

export const Login = () => {
  const navigate = useNavigate()

  const handleLoginClick = async () => {
    try {
      await refreshAccessToken()
      navigate(ROUTES.CALLBACK)
    } catch (e) {
      await requestAuthorization()
    }
  }

  return (
    <Container>
      <AnimatedBg />
      <Button
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onClick={handleLoginClick}
        variant="contained"
        startIcon={<Lock />}
        sx={{ alignSelf: 'center' }}
      >
        Login with Spotify
      </Button>
    </Container>
  )
}
