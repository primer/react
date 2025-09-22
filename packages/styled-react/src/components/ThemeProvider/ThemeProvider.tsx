import {
  ThemeProvider as PrimerThemeProvider,
  type ThemeProviderProps as PrimerThemeProviderProps,
  useTheme as usePrimerTheme,
} from '@primer/react'
import deepmerge from 'deepmerge'
import {createContext, useContext, useMemo, type PropsWithChildren} from 'react'
import {ThemeProvider as SCThemeProvider} from 'styled-components'
import defaultTheme from '../../theme'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Theme = {[key: string]: any}

type ThemeProviderProps = PropsWithChildren<
  PrimerThemeProviderProps & {
    theme?: Theme
  }
>

type ColorMode = 'day' | 'night' | 'light' | 'dark'
type ColorModeWithAuto = ColorMode | 'auto'

const ThemeContext = createContext<{
  theme?: Theme
  colorScheme?: string
  colorMode?: ColorModeWithAuto
  resolvedColorMode?: ColorMode
  resolvedColorScheme?: string
  dayScheme?: string
  nightScheme?: string
  setColorMode: React.Dispatch<React.SetStateAction<ColorModeWithAuto>>
  setDayScheme: React.Dispatch<React.SetStateAction<string>>
  setNightScheme: React.Dispatch<React.SetStateAction<string>>
}>({
  setColorMode: () => null,
  setDayScheme: () => null,
  setNightScheme: () => null,
})

function useTheme() {
  return useContext(ThemeContext)
}

function ThemeProvider({children, theme, ...rest}: ThemeProviderProps) {
  return (
    <PrimerThemeProvider {...rest}>
      <ThemeProviderImpl theme={theme}>{children}</ThemeProviderImpl>
    </PrimerThemeProvider>
  )
}

function ThemeProviderImpl({children, ...rest}: ThemeProviderProps) {
  const primerTheme = usePrimerTheme()
  const {theme: fallbackTheme} = useTheme()
  // Initialize state
  const theme = rest.theme ?? fallbackTheme ?? defaultTheme
  const {resolvedTheme, resolvedColorScheme} = useMemo(
    () => applyColorScheme(theme, primerTheme.colorScheme!),
    [theme, primerTheme.colorScheme],
  )
  const value = useMemo(() => {
    return {
      ...primerTheme,
      theme: resolvedTheme,
      resolvedColorScheme,
    }
  }, [primerTheme, resolvedTheme, resolvedColorScheme])

  return (
    <ThemeContext.Provider value={value}>
      <SCThemeProvider theme={resolvedTheme}>{children}</SCThemeProvider>
    </ThemeContext.Provider>
  )
}

function applyColorScheme(
  theme: Theme,
  colorScheme: string,
): {resolvedTheme: Theme; resolvedColorScheme: string | undefined} {
  if (!theme.colorSchemes) {
    return {
      resolvedTheme: theme,
      resolvedColorScheme: undefined,
    }
  }

  if (!theme.colorSchemes[colorScheme]) {
    // eslint-disable-next-line no-console
    console.error(`\`${colorScheme}\` scheme not defined in \`theme.colorSchemes\``)

    // Apply the first defined color scheme
    const defaultColorScheme = Object.keys(theme.colorSchemes)[0]
    return {
      resolvedTheme: deepmerge(theme, theme.colorSchemes[defaultColorScheme]),
      resolvedColorScheme: defaultColorScheme,
    }
  }

  return {
    resolvedTheme: deepmerge(theme, theme.colorSchemes[colorScheme]),
    resolvedColorScheme: colorScheme,
  }
}

export {ThemeProvider, useTheme}
export type {ThemeProviderProps, Theme}
