import React, {type PropsWithChildren} from 'react'
import {ThemeProvider as SCThemeProvider} from 'styled-components'
import {
  ThemeProvider as PRCThemeProvider,
  type ThemeProviderProps,
  useTheme,
  theme as fallbackTheme,
} from '@primer/react'

export const ThemeProvider = (props: PropsWithChildren<ThemeProviderProps>) => {
  const {children, ...rest} = props
  const {theme} = useTheme()

  console.log({theme})
  return (
    <SCThemeProvider theme={theme || fallbackTheme}>
      <PRCThemeProvider {...rest}>{children}</PRCThemeProvider>
    </SCThemeProvider>
  )
}
