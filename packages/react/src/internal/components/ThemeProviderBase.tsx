import type React from 'react'
import {ThemeContext} from '../../ThemeContext'
import type {ThemeProviderProps} from '../../ThemeProvider'
import type {ThemeProviderValue} from '../hooks/useThemeProvider'

export const ThemeProviderBase: React.FC<
  React.PropsWithChildren<Pick<ThemeProviderProps, 'contextOnly'> & {value: ThemeProviderValue}>
> = ({children, contextOnly, value}) => {
  if (contextOnly) {
    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  }

  return (
    <ThemeContext.Provider value={value}>
      <div
        data-component="ThemeProvider"
        data-color-mode={value.colorMode === 'auto' ? 'auto' : value.colorScheme.includes('dark') ? 'dark' : 'light'}
        data-light-theme={value.dayScheme}
        data-dark-theme={value.nightScheme}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  )
}
