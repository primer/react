import React from 'react'
import {ThemeContext, type ThemeContextValue} from './ThemeContext'

export function useTheme(): ThemeContextValue {
  return React.useContext(ThemeContext)
}

export function useColorSchemeVar(values: Partial<Record<string, string>>, fallback: string) {
  const {colorScheme = ''} = useTheme()
  return values[colorScheme] ?? fallback
}
