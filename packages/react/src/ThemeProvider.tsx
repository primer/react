import React from 'react'
import deepmerge from 'deepmerge'
import {ThemeProviderBase} from './internal/components/ThemeProviderBase'
import {useThemeProvider} from './internal/hooks/useThemeProvider'
import defaultTheme from './theme'

export const defaultColorMode = 'day'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Theme = {[key: string]: any}
export type ColorMode = 'day' | 'night' | 'light' | 'dark'
export type ColorModeWithAuto = ColorMode | 'auto'

export type ThemeProviderProps = {
  colorMode?: ColorModeWithAuto
  dayScheme?: string
  nightScheme?: string
  /**
   * @deprecated This prop is no longer used and has no effect.
   */
  preventSSRMismatch?: boolean
  /**
   * When true, only provides theme context to descendants without rendering
   * a wrapping `<div>` with `data-*` theme attributes.
   * @default false
   */
  contextOnly?: boolean
}

/**
 * @deprecated Use `ThemeProvider` from `@primer/react/next` to migrate away from JavaScript theme values.
 */
export const ThemeProvider: React.FC<React.PropsWithChildren<ThemeProviderProps>> = ({children, ...props}) => {
  const {parentValue, value} = useThemeProvider(props)
  const theme = parentValue.theme ?? defaultTheme
  const {resolvedTheme, resolvedColorScheme} = React.useMemo(
    () => applyColorScheme(theme, value.colorScheme),
    [theme, value.colorScheme],
  )

  const contextValue = React.useMemo(
    () => ({
      ...value,
      theme: resolvedTheme,
      resolvedColorScheme,
    }),
    [value, resolvedTheme, resolvedColorScheme],
  )

  return (
    <ThemeProviderBase contextOnly={props.contextOnly} value={contextValue}>
      {children}
    </ThemeProviderBase>
  )
}

function applyColorScheme(
  theme: Theme,
  colorScheme: string,
): {resolvedTheme: Theme; resolvedColorScheme: string | undefined} {
  if (!theme.colorSchemes) {
    return {resolvedTheme: theme, resolvedColorScheme: undefined}
  }

  if (!theme.colorSchemes[colorScheme]) {
    // eslint-disable-next-line no-console
    console.error(`\`${colorScheme}\` scheme not defined in \`theme.colorSchemes\``)
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

export default ThemeProvider
