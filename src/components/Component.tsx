import { useContext } from 'react'
import { Box, Button, Container, Link, Typography } from '@mui/material'
import { ColorModeContext } from '../theme'

export const Component = () => {
  const { toggleColorMode } = useContext(ColorModeContext)

  return (
    <Container maxWidth="sm">
      <Button onClick={toggleColorMode}>CLICK</Button>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          Material UI Vite.js example in TypeScript
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          {'Copyright © '}
          <Link color="inherit" href="https://mui.com/">
            Your Website
          </Link>{' '}
          {new Date().getFullYear()}.
        </Typography>
      </Box>
    </Container>
  )
}
