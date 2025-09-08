import React from 'react'
import {ThemeProvider as PrimerThemeProvider, useTheme as usePrimerTheme} from '@primer/react'
import type {ThemeProviderProps as PrimerThemeProviderProps} from '@primer/react'
import {ThemeProvider as SCThemeProvider} from 'styled-components'
import {useTheme} from './useTheme'

type Theme = {[key: string]: any}

type ThemeProviderProps = React.PropsWithChildren<
  PrimerThemeProviderProps & {
    theme?: Theme
  }
>

function ThemeProvider({children}: ThemeProviderProps) {
  return (
    <PrimerThemeProvider>
      <ThemeProviderImpl>{children}</ThemeProviderImpl>
    </PrimerThemeProvider>
  )
}

function ThemeProviderImpl({children}: React.PropsWithChildren) {
  const primerTheme = usePrimerTheme()

  // Get fallback values from parent ThemeProvider (if exists)
  const {
    // theme: fallbackTheme,
    // colorMode: fallbackColorMode,
    // dayScheme: fallbackDayScheme,
    // nightScheme: fallbackNightScheme,
  } = useTheme()

  // Initialize state
  // const theme = props.theme ?? fallbackTheme ?? defaultTheme

  // const {resolvedTheme, resolvedColorScheme} = React.useMemo(
  // () => applyColorScheme(theme, colorScheme),
  // [theme, colorScheme],
  // )

  return <SCThemeProvider theme={resolvedTheme}>{children}</SCThemeProvider>
}

export {ThemeProvider}
export type {Theme, ThemeProviderProps}
