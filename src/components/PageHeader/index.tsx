import { type ReactElement } from 'react'
import styled from '@emotion/styled'
import { Box } from '@mui/material'

const Container = styled.section`
  width: fit-content;
  margin-bottom: 48px;
`

const StyledTitle = styled.h1`
  color: var(--mui-palette-primary-main);
  font-weight: bold;
  font-size: 60px;
  margin: 0px;
`

const StyledText = styled.p`
  margin: 0;
`

type Props = {
  title: string
  text: string
  actions?: ReactElement[]
}

export const PageHeader = ({ title, text, actions }: Props) => {
  return (
    <Container>
      <StyledTitle>{title}</StyledTitle>
      <StyledText>{text}</StyledText>
      <Box
        sx={{
          marginTop: '24px',
          display: 'grid',
          width: 'fit-content',
          gridAutoFlow: 'column',
          gap: '16px'
        }}
      >
        {actions && actions.map((action) => action)}
      </Box>
    </Container>
  )
}
