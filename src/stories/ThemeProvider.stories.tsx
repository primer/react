/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react'
import {Meta, Story} from '@storybook/react'

import {ThemeProvider, BaseStyles, BorderBox, themeGet, useTheme} from '..'
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
      <BorderBox my={3} p={3} color="text.primary" bg="bg.canvas">
        Always night mode (<ActiveColorScheme />)
      </BorderBox>
    </ThemeProvider>
  )
}

function InverseMode() {
  const {resolvedColorMode} = useTheme()
  return (
    <ThemeProvider colorMode={resolvedColorMode === 'day' ? 'night' : 'day'}>
      <BorderBox my={3} p={3} color="text.primary" bg="bg.canvas">
        Always inverse of parent mode (<ActiveColorScheme />)
      </BorderBox>
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
