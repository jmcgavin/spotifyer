import styled from '@emotion/styled'
import { IconButton, Tooltip, useColorScheme } from '@mui/material'
import { Brightness7, Brightness4, GitHub } from '@mui/icons-material'

import { GITHUB_REPO } from '../../constants'

const StyledHeader = styled.header`
  display: flex;
  justify-content: end;
  gap: 4px;
`

export const Header = () => {
  const { mode: colorMode, setMode: setColorMode } = useColorScheme()

  return (
    <StyledHeader>
      <Tooltip title={`${colorMode === 'light' ? 'Dark' : 'Light'} mode`} disableInteractive>
        <IconButton onClick={() => setColorMode(colorMode === 'light' ? 'dark' : 'light')}>
          {colorMode === 'dark' ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
      </Tooltip>
      <Tooltip title="GitHub" disableInteractive>
        <IconButton onClick={() => window.open(GITHUB_REPO, '_blank')}>
          <GitHub />
        </IconButton>
      </Tooltip>
    </StyledHeader>
  )
}
