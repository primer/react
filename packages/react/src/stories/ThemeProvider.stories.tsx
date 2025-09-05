import type {Meta, StoryFn} from '@storybook/react-vite'

import {ThemeProvider, BaseStyles, useTheme} from '..'
import type {ThemeProviderProps} from '../ThemeProvider'
import classes from './ThemeProviderStories.module.css'

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
      <div className={classes.ThemedContainer}>
        Always night mode (<ActiveColorScheme />)
      </div>
    </ThemeProvider>
  )
}

function InverseMode() {
  const {resolvedColorMode} = useTheme()
  return (
    <ThemeProvider colorMode={resolvedColorMode === 'day' ? 'night' : 'day'}>
      <div className={classes.ThemedContainer}>
        Always inverse of parent mode (<ActiveColorScheme />)
      </div>
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
    <div className={classes.AutoContainer}>
      colorMode: {colorMode} <br />
      resolvedColorMode: {resolvedColorMode} <br />
    </div>
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
