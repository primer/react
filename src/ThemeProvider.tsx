import deepmerge from 'deepmerge'
import React from 'react'
import {ThemeProvider as ScThemeProvider} from 'styled-components'
import theme from './theme'

// TODO: write comments
// TODO: write tests

const DEFAULT_COLOR_SCHEME = 'light'

type ColorMode = 'day' | 'night'
type ColorScheme = typeof DEFAULT_COLOR_SCHEME | 'dark' | 'dark_dimmed' // TODO: compute this from theme object
type AutoColorScheme = Record<ColorMode, ColorScheme>
type ColorSchemeWithAuto = ColorScheme | AutoColorScheme

export type ThemeProviderProps = {
  initialColorScheme?: ColorSchemeWithAuto
  children?: React.ReactNode
}

const ThemeContext = React.createContext<
  [ColorSchemeWithAuto, React.Dispatch<React.SetStateAction<ColorSchemeWithAuto>>]
>([DEFAULT_COLOR_SCHEME, () => {}])

function ThemeProvider({children, initialColorScheme = DEFAULT_COLOR_SCHEME}: ThemeProviderProps) {
  const systemColorMode = useSystemColorMode()
  // TODO: should this still be named `colorScheme` even though it
  // could be an `auto` object? ({day: 'light', night: 'dark'})
  const [colorScheme, setColorScheme] = useColorScheme(initialColorScheme)
  const activeColorScheme = getActiveColorScheme(colorScheme, systemColorMode)
  const activeTheme = React.useMemo(() => applyColorScheme(theme, activeColorScheme), [activeColorScheme])

  return (
    <ThemeContext.Provider value={[colorScheme, setColorScheme]}>
      <ScThemeProvider theme={activeTheme}>{children}</ScThemeProvider>
    </ThemeContext.Provider>
  )
}

function useSystemColorMode() {
  const [systemColorMode, setSystemColorMode] = React.useState(getSystemColorMode())

  React.useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')

    function handleChange(event: MediaQueryListEvent) {
      const isNight = event.matches
      const systemColorMode = isNight ? 'night' : 'day'
      setSystemColorMode(systemColorMode)
    }

    // TODO: look into browser support
    media.addEventListener('change', handleChange)

    return function cleanup() {
      media.removeEventListener('change', handleChange)
    }
  }, [])

  return systemColorMode
}

function getSystemColorMode(): ColorMode {
  if (window.matchMedia && window.matchMedia(`(prefers-color-scheme: dark)`).matches) {
    return 'night'
  }

  return 'day'
}

function useColorScheme(
  initialColorScheme: ColorSchemeWithAuto
): [ColorSchemeWithAuto, React.Dispatch<React.SetStateAction<ColorSchemeWithAuto>>] {
  const [colorScheme, setColorScheme] = React.useState<ColorSchemeWithAuto>(initialColorScheme)

  React.useEffect(() => {
    setColorScheme(initialColorScheme)
  }, [initialColorScheme])

  return [colorScheme, setColorScheme]
}

function getActiveColorScheme(colorScheme: ColorSchemeWithAuto, systemColorMode: ColorMode): ColorScheme {
  if (isAutoColorScheme(colorScheme)) {
    return colorScheme[systemColorMode]
  }

  return colorScheme
}

function isAutoColorScheme(colorScheme: ColorSchemeWithAuto): colorScheme is AutoColorScheme {
  return typeof colorScheme === 'object'
}

function applyColorScheme(theme: any, colorScheme: ColorScheme) {
  if (colorScheme === DEFAULT_COLOR_SCHEME) {
    return theme
  }

  const activeTheme = deepmerge(theme, {
    colors: theme.colors.schemes[colorScheme],
    shadows: theme.shadows.schemes[colorScheme]
  })

  // prevent components from accessing values from non-active schemes
  delete activeTheme.colors.schemes
  delete activeTheme.shadows.schemes

  return activeTheme
}

export function useTheme() {
  return React.useContext(ThemeContext)
}

export default ThemeProvider
