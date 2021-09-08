import React from 'react'
import {Meta, Story} from '@storybook/react'

import {ThemeProvider, BaseStyles, Box, themeGet, useTheme} from '..'
import {ThemeProviderProps} from '../ThemeProvider'
import {createGlobalStyle} from 'styled-components'

export default {
  title: 'Generic behaviors/ThemeProvider',
  component: ThemeProvider,
  argTypes: {
    theme: {
      table: {
        disable: true
      }
    }
  }
} as Meta

const GlobalStyle = createGlobalStyle`
    body {
        background-color: ${themeGet('colors.bg.canvas')};
    }
`

function ActiveColorScheme() {
  const {colorScheme} = useTheme()
  return <span>Active color scheme: {colorScheme}</span>
}

export const Default: Story<ThemeProviderProps> = args => {
  return (
    <ThemeProvider {...args}>
      <GlobalStyle />
      <BaseStyles>
        <ActiveColorScheme />
      </BaseStyles>
    </ThemeProvider>
  )
}

Default.args = {
  colorMode: 'day',
  dayScheme: 'light',
  nightScheme: 'dark'
}

function NightMode() {
  return (
    <ThemeProvider colorMode="night">
      <Box
        my={3}
        p={3}
        color="fg.default"
        bg="canvas.default"
        borderWidth="1px"
        borderStyle="solid"
        borderColor="border.default"
        borderRadius={2}
      >
        Always night mode (<ActiveColorScheme />)
      </Box>
    </ThemeProvider>
  )
}

function InverseMode() {
  const {resolvedColorMode} = useTheme()
  return (
    <ThemeProvider colorMode={resolvedColorMode === 'day' ? 'night' : 'day'}>
      <Box
        my={3}
        p={3}
        color="fg.default"
        bg="canvas.default"
        borderWidth="1px"
        borderStyle="solid"
        borderColor="border.default"
        borderRadius={2}
      >
        Always inverse of parent mode (<ActiveColorScheme />)
      </Box>
    </ThemeProvider>
  )
}

export const Nested: Story<ThemeProviderProps> = args => {
  return (
    <ThemeProvider {...args}>
      <GlobalStyle />
      <BaseStyles>
        <ActiveColorScheme />
        <NightMode />
        <InverseMode />
      </BaseStyles>
    </ThemeProvider>
  )
}

Nested.args = {
  colorMode: 'day',
  dayScheme: 'light',
  nightScheme: 'dark_dimmed'
}
