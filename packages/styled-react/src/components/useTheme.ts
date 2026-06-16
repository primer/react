import React from 'react'
import {ThemeContext} from './ThemeContext'

export function useTheme() {
  return React.useContext(ThemeContext)
}

export function useColorSchemeVar(values: Partial<Record<string, string>>, fallback: string) {
  const {colorScheme = ''} = useTheme()
  return values[colorScheme] ?? fallback
}
