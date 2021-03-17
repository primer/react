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
  dayScheme?: string
  nightScheme?: string
  setColorMode: React.Dispatch<React.SetStateAction<ColorModeWithAuto>>
  setDayScheme: React.Dispatch<React.SetStateAction<string>>
  setNightScheme: React.Dispatch<React.SetStateAction<string>>
}>({
  setColorMode: () => {},
  setDayScheme: () => {},
  setNightScheme: () => {}
})

function ThemeProvider({children, ...props}: ThemeProviderProps) {
  // Get fallback values from parent ThemeProvider (if exists)
  const {
    theme: fallbackTheme,
    colorMode: fallbackColorMode,
    dayScheme: fallbackDayScheme,
    nightScheme: fallbackNightScheme
  } = useTheme()

  // Initialize state
  const theme = props.theme ?? fallbackTheme ?? defaultTheme
  const [colorMode, setColorMode] = React.useState(props.colorMode ?? fallbackColorMode ?? defaultColorMode)
  const [dayScheme, setDayScheme] = React.useState(props.dayScheme ?? fallbackDayScheme ?? defaultDayScheme)
  const [nightScheme, setNightScheme] = React.useState(props.nightScheme ?? fallbackNightScheme ?? defaultNightScheme)
  const systemColorMode = useSystemColorMode()
  const colorScheme = getColorScheme(colorMode, dayScheme, nightScheme, systemColorMode)
  const resolvedTheme = applyColorScheme(theme, colorScheme)

  // Update state if props change
  React.useEffect(() => {
    setColorMode(props.colorMode ?? fallbackColorMode ?? defaultColorMode)
  }, [props.colorMode])

  React.useEffect(() => {
    setDayScheme(props.dayScheme ?? fallbackDayScheme ?? defaultDayScheme)
  }, [props.dayScheme])

  React.useEffect(() => {
    setNightScheme(props.nightScheme ?? fallbackNightScheme ?? defaultNightScheme)
  }, [props.nightScheme])

  return (
    <ThemeContext.Provider
      value={{
        theme,
        colorMode,
        dayScheme,
        nightScheme,
        setColorMode,
        setDayScheme,
        setNightScheme
      }}
    >
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
