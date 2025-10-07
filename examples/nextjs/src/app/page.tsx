'use client'

import {Box, Button, Stack} from '@primer/react'
import styled from 'styled-components'

const StyledDiv = styled.div(({theme}) => {
  console.log({styledTheme: theme})
  return {
    padding: theme.space[5],
    backgroundColor: theme.colors.btn.primary.bg,
  }
})

export default function IndexPage() {
  return (
    <Stack direction="horizontal">
      <Button variant="primary" sx={{padding: 5}}>
        Hello world
      </Button>
      <Box sx={{padding: 5, backgroundColor: 'btn.primary.bg'}}>Hello world</Box>
      <StyledDiv>Hello world</StyledDiv>
    </Stack>
  )
}
