import React from 'react'
import {ThemeProvider as SCThemeProvider} from 'styled-components'
import defaultTheme from './theme'
import deepmerge from 'deepmerge' // TODO: review dependency

type Theme = any

export type ThemeProviderProps = {
  theme?: Theme
  children: React.ReactNode
}

function ThemeProvider({theme = defaultTheme, children}: ThemeProviderProps) {
  const resolvedTheme = applyColorScheme(theme, 'light')
  return <SCThemeProvider theme={resolvedTheme}>{children}</SCThemeProvider>
}

function applyColorScheme(theme: Theme, colorScheme: string) {
  if (!theme.colorSchemes || !theme.colorSchemes[colorScheme]) {
    return theme
  }

  return deepmerge(theme, theme.colorSchemes[colorScheme])
}

export default ThemeProvider
