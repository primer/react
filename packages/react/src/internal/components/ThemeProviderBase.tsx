import React from 'react'
import {ThemeContext, type ThemeContextValue} from '../../ThemeContext'
import type {ThemeProviderProps} from '../../ThemeProvider'
import {ThemeStyle} from '../theme/ThemeStyle'

export const ThemeProviderBase: React.FC<
  React.PropsWithChildren<Pick<ThemeProviderProps, 'contextOnly'> & {value: ThemeContextValue}>
> = ({children, contextOnly, value}) => {
  if (contextOnly) {
    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  }

  if (value.themeDefinition) {
    return <ThemeProviderWithIdentity value={value}>{children}</ThemeProviderWithIdentity>
  }

  return (
    <ThemeContext.Provider value={value}>
      <div
        data-component="ThemeProvider"
        data-color-mode={value.colorMode === 'auto' ? 'auto' : value.colorScheme?.includes('dark') ? 'dark' : 'light'}
        data-light-theme={value.dayScheme}
        data-dark-theme={value.nightScheme}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

const ThemeProviderWithIdentity: React.FC<React.PropsWithChildren<{value: ThemeContextValue}>> = ({
  children,
  value,
}) => {
  const scope = React.useId().replace(/[^a-zA-Z0-9_-]/g, '_')
  return (
    <ThemeContext.Provider value={value}>
      <div
        data-component="ThemeProvider"
        data-color-mode={value.colorMode === 'auto' ? 'auto' : value.colorScheme?.includes('dark') ? 'dark' : 'light'}
        data-light-theme={value.dayScheme}
        data-dark-theme={value.nightScheme}
        data-primer-theme={value.themeDefinition?.name}
        data-primer-theme-scope={scope}
      >
        <ThemeStyle value={value} scope={scope} />
        {children}
      </div>
    </ThemeContext.Provider>
  )
}
