'use client'

import {Button, Stack, Box} from '@primer/react'
import {useTheme} from '@primer/styled-react'
import styled from 'styled-components'

const StyledDiv = styled.div(({theme}) => {
  return {
    padding: theme.space[5],
    backgroundColor: theme.colors.btn.primary.bg,
  }
})

const ThemeUser = () => {
  const {theme} = useTheme()
  return (
    <div
      style={{
        padding: theme?.space[5],
        backgroundColor: theme?.colors.btn.primary.bg,
      }}
    >
      Hello world
    </div>
  )
}

export default function IndexPage() {
  return (
    <Stack direction="horizontal">
      <Button variant="primary" sx={{padding: 5}}>
        Hello world
      </Button>
      <Box sx={{padding: 5, backgroundColor: 'btn.primary.bg'}}>Hello world</Box>
      <StyledDiv>Hello world</StyledDiv>
      <ThemeUser />
    </Stack>
  )
}
