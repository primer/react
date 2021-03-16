import React from 'react'
import {ThemeProvider as SCThemeProvider} from 'styled-components'
import defaultTheme from './theme'
import deepmerge from 'deepmerge' // TODO: review dependency

const DEFAULT_COLOR_MODE = 'day'
const DEFAULT_DAY_SCHEME = 'light'
const DEFAULT_NIGHT_SCHEME = 'dark'

type Theme = any
type ColorMode = 'day' | 'night'
type ColorModeWithAuto = ColorMode | 'auto'

export type ThemeProviderProps = {
  theme?: Theme
  colorMode?: ColorModeWithAuto
  dayScheme?: string
  nightScheme?: string
  children: React.ReactNode
}

function ThemeProvider({theme = defaultTheme, colorMode, dayScheme, nightScheme, children}: ThemeProviderProps) {
  const colorScheme = getColorScheme(
    colorMode ?? DEFAULT_COLOR_MODE,
    dayScheme ?? DEFAULT_DAY_SCHEME,
    nightScheme ?? DEFAULT_NIGHT_SCHEME
  )
  const resolvedTheme = applyColorScheme(theme, colorScheme)
  return <SCThemeProvider theme={resolvedTheme}>{children}</SCThemeProvider>
}

function getColorScheme(colorMode: ColorModeWithAuto, dayScheme: string, nightScheme: string) {
  switch (colorMode) {
    case 'auto':
      return dayScheme // TODO: implement auto mode
    case 'day':
      return dayScheme
    case 'night':
      return nightScheme
  }
}

function applyColorScheme(theme: Theme, colorScheme: string) {
  if (!theme.colorSchemes || !theme.colorSchemes[colorScheme]) {
    return theme
  }

  return deepmerge(theme, theme.colorSchemes[colorScheme])
}

export default ThemeProvider
