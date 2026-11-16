'use client'

import React from 'react'

export type ColorMode = 'light' | 'dark' | 'day' | 'night'
export type ColorModeWithAuto = ColorMode | 'auto'

export interface ThemeContextValue {
  colorMode: ColorModeWithAuto
  resolvedColorMode: 'light' | 'dark'
  dayScheme: string
  nightScheme: string
  setColorMode: (colorMode: ColorModeWithAuto) => void
  setDayScheme: (scheme: string) => void
  setNightScheme: (scheme: string) => void
}

export const ThemeContext = React.createContext<ThemeContextValue | null>(null)

export function useTheme() {
  const context = React.useContext(ThemeContext)
  if (context === null) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
