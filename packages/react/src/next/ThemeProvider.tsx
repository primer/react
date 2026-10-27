import type React from 'react'
import {ThemeProviderBase} from '../internal/components/ThemeProviderBase'
import {useThemeProvider} from '../internal/hooks/useThemeProvider'
import type {ThemeProviderProps} from '../ThemeProvider'

export const ThemeProvider: React.FC<React.PropsWithChildren<ThemeProviderProps>> = ({children, ...props}) => {
  const {value} = useThemeProvider(props)

  return (
    <ThemeProviderBase contextOnly={props.contextOnly} value={value}>
      {children}
    </ThemeProviderBase>
  )
}

export default ThemeProvider
