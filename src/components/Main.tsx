import { useContext } from 'react'
import { AppBar, Box, Button, Container, IconButton, Link, Toolbar, Typography } from '@mui/material'
import { ColorModeContext } from '../theme'
import MenuIcon from '@mui/icons-material/Menu'

export const Main = () => {
  const { toggleColorMode } = useContext(ColorModeContext)

  return (
    <AppBar position="static" color="primary" enableColorOnDark>
      <Typography variant="h6">Save2Spotify</Typography>
      <IconButton onClick={toggleColorMode}>
        <MenuIcon />
      </IconButton>
    </AppBar>
  )
}
