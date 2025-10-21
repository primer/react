'use client'

import {Button, Stack} from '@primer/react'
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
      <Button variant="primary" style={{padding: 'var(--base-size-32)'}}>
        Hello world
      </Button>
      <div style={{padding: 'var(--base-size-32)', backgroundColor: 'var(--button-primary-bgColor-rest)'}}>
        Hello world
      </div>
      <StyledDiv>Hello world</StyledDiv>
      <ThemeUser />
    </Stack>
  )
}
