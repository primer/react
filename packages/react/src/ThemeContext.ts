import React from 'react'
import type {ColorMode, ColorModeWithAuto, Theme} from './ThemeProvider'

export interface ThemeContextValue {
  /** @deprecated Use `ThemeProvider` and `useTheme` from `@primer/react/next` to migrate away from JavaScript theme values. */
  theme?: Theme
  colorScheme?: string
  colorMode?: ColorModeWithAuto
  resolvedColorMode?: ColorMode
  /** @deprecated Use `ThemeProvider` and `useTheme` from `@primer/react/next` to migrate away from JavaScript theme values. */
  resolvedColorScheme?: string
  dayScheme?: string
  nightScheme?: string
  setColorMode: React.Dispatch<React.SetStateAction<ColorModeWithAuto>>
  setDayScheme: React.Dispatch<React.SetStateAction<string>>
  setNightScheme: React.Dispatch<React.SetStateAction<string>>
}

export const ThemeContext = React.createContext<ThemeContextValue>({
  setColorMode: () => null,
  setDayScheme: () => null,
  setNightScheme: () => null,
})
