import type {Meta, StoryFn} from '@storybook/react-vite'

import {ThemeProvider, BaseStyles, Box, useTheme} from '..'
import type {ThemeProviderProps} from '../ThemeProvider'
import './ThemeProviderStories.module.css'

export default {
  title: 'Behaviors/ThemeProvider',
  component: ThemeProvider,
  parameters: {disableThemeDecorator: true},
  argTypes: {
    theme: {
      table: {
        disable: true,
      },
    },
  },
} as Meta

function ActiveColorScheme() {
  const {colorScheme} = useTheme()
  return <span>Active color scheme: {colorScheme}</span>
}

export const Default: StoryFn<ThemeProviderProps> = args => {
  return (
    <ThemeProvider {...args}>
      <BaseStyles>
        <ActiveColorScheme />
      </BaseStyles>
    </ThemeProvider>
  )
}

Default.args = {
  colorMode: 'day',
  dayScheme: 'light',
  nightScheme: 'dark',
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

export const Nested: StoryFn<ThemeProviderProps> = args => {
  return (
    <ThemeProvider {...args}>
      <BaseStyles>
        <ActiveColorScheme />
        <NightMode />
        <InverseMode />
      </BaseStyles>
    </ThemeProvider>
  )
}

const AutoContents = () => {
  const {colorMode, resolvedColorMode} = useTheme()

  return (
    <Box sx={{padding: 10, backgroundColor: 'canvas.inset', color: 'fg.default'}}>
      colorMode: {colorMode} <br />
      resolvedColorMode: {resolvedColorMode} <br />
    </Box>
  )
}

export const Auto = () => {
  return (
    <ThemeProvider colorMode="auto">
      <BaseStyles>
        <AutoContents />
      </BaseStyles>
    </ThemeProvider>
  )
}
