import deepmerge from 'deepmerge'
import React from 'react'
import {ThemeProvider as ScThemeProvider} from 'styled-components'
import defaultTheme from './theme'

const defaultColorScheme = 'light'

type ColorScheme = 'light' | 'dark' | 'dark_dimmed' // TODO: compute this from theme object

const ColorSchemeContext = React.createContext<[ColorScheme, React.Dispatch<React.SetStateAction<ColorScheme>>]>([
  defaultColorScheme,
  () => {}
])

export type ThemeProviderProps = {
  initialColorScheme?: ColorScheme
  children?: React.ReactNode
}

function ThemeProvider({children, initialColorScheme = defaultColorScheme}: ThemeProviderProps) {
  const [colorScheme, setColorScheme] = React.useState<ColorScheme>(initialColorScheme)
  const theme = React.useMemo(() => applyColorScheme(defaultTheme, colorScheme), [colorScheme])
  React.useEffect(() => {
    setColorScheme(initialColorScheme)
  }, [initialColorScheme])
  return (
    <ColorSchemeContext.Provider value={[colorScheme, setColorScheme]}>
      <ScThemeProvider theme={theme}>{children}</ScThemeProvider>
    </ColorSchemeContext.Provider>
  )
}

function applyColorScheme(theme: any, colorScheme: ColorScheme) {
  if (colorScheme === 'light') {
    return theme
  }
  return deepmerge(theme, {colors: theme.colors.schemes[colorScheme], shadows: theme.shadows.schemes[colorScheme]})
}

export function useColorScheme() {
  return React.useContext(ColorSchemeContext)
}

export default ThemeProvider
