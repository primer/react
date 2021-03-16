import React from 'react'
import {ThemeProvider as SCThemeProvider} from 'styled-components'
import defaultTheme from './theme'
import deepmerge from 'deepmerge' // TODO: review dependency

const defaultColorMode = 'day'
const defaultDayScheme = 'light'
const defaultNightScheme = 'dark'

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

const ThemeContext = React.createContext<{
  theme?: Theme
  colorMode?: ColorModeWithAuto
  setColorMode: React.Dispatch<React.SetStateAction<ColorModeWithAuto>>
}>({
  setColorMode: () => {}
})

function ThemeProvider({dayScheme, nightScheme, children, ...props}: ThemeProviderProps) {
  // Get fallback values from parent ThemeProvider (if exists)
  const {theme: fallbackTheme} = useTheme()

  const theme = props.theme ?? fallbackTheme ?? defaultTheme
  const [colorMode, setColorMode] = React.useState(props.colorMode ?? defaultColorMode)

  const systemColorMode = useSystemColorMode()

  const colorScheme = getColorScheme(
    colorMode,
    dayScheme ?? defaultDayScheme,
    nightScheme ?? defaultNightScheme,
    systemColorMode
  )

  const resolvedTheme = applyColorScheme(theme, colorScheme)

  React.useEffect(() => {
    setColorMode(props.colorMode ?? defaultColorMode)
  }, [props.colorMode])

  return (
    <ThemeContext.Provider value={{theme, colorMode, setColorMode}}>
      <SCThemeProvider theme={resolvedTheme}>{children}</SCThemeProvider>
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return React.useContext(ThemeContext)
}

function useSystemColorMode() {
  const [systemColorMode, setSystemColorMode] = React.useState(getSystemColorMode)

  React.useEffect(() => {
    const media = window?.matchMedia?.('(prefers-color-scheme: dark)')

    function handleChange(event: MediaQueryListEvent) {
      const isNight = event.matches
      const systemColorMode = isNight ? 'night' : 'day'
      setSystemColorMode(systemColorMode)
    }

    // TODO: look into browser support
    media?.addEventListener('change', handleChange)

    return function cleanup() {
      media?.removeEventListener('change', handleChange)
    }
  }, [])

  return systemColorMode
}

function getSystemColorMode(): ColorMode {
  if (window?.matchMedia?.('(prefers-color-scheme: dark)')?.matches) {
    return 'night'
  }

  return 'day'
}

function getColorScheme(
  colorMode: ColorModeWithAuto,
  dayScheme: string,
  nightScheme: string,
  systemColorMode: ColorMode
) {
  switch (colorMode) {
    case 'auto':
      return systemColorMode === 'day' ? dayScheme : nightScheme
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
