import React from 'react'
import {ThemeProvider as ScThemeProvider} from 'styled-components'
import theme from './theme'

export type ThemeProviderProps = {
  children?: React.ReactNode
}

function ThemeProvider({children}: ThemeProviderProps) {
  return <ScThemeProvider theme={theme}>{children}</ScThemeProvider>
}

export default ThemeProvider
