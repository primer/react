import type React from 'react'
import {
  ThemeProvider as PrimerThemeProvider,
  useTheme as primerUseTheme,
  BaseStyles as PrimerBaseStyles,
} from '@primer/react'
import type {
  ThemeProviderProps as PrimerThemeProviderProps,
  BaseStylesProps as PrimerBaseStylesProps,
} from '@primer/react'
import {useFeatureFlag} from '@primer/react/experimental'
import {ThemeProvider as StyledThemeProvider, useTheme as styledUseTheme, useColorSchemeVar} from './ThemeProvider'
import type {ThemeProviderProps as StyledThemeProviderProps} from './ThemeProvider'
import {BaseStyles as StyledBaseStyles} from './BaseStyles'
import type {BaseStylesProps as StyledBaseStylesProps} from './BaseStyles'

export type ThemeProviderProps = StyledThemeProviderProps

export type BaseStylesProps = StyledBaseStylesProps

export const ThemeProvider: React.FC<React.PropsWithChildren<ThemeProviderProps>> = ({children, ...props}) => {
  const enabled = useFeatureFlag('primer_react_styled_react_use_primer_theme_providers')
  if (enabled) {
    return <PrimerThemeProvider {...(props as PrimerThemeProviderProps)}>{children}</PrimerThemeProvider>
  }
  return <StyledThemeProvider {...props}>{children}</StyledThemeProvider>
}

export function useTheme(): ReturnType<typeof primerUseTheme> {
  const enabled = useFeatureFlag('primer_react_styled_react_use_primer_theme_providers')
  const styledTheme = styledUseTheme()
  const primerTheme = primerUseTheme()
  if (enabled) {
    return primerTheme as ReturnType<typeof primerUseTheme>
  }
  return styledTheme
}

export {useColorSchemeVar}

export function BaseStyles(props: BaseStylesProps) {
  const enabled = useFeatureFlag('primer_react_styled_react_use_primer_theme_providers')
  if (enabled) {
    return <PrimerBaseStyles {...(props as PrimerBaseStylesProps)} />
  }
  return <StyledBaseStyles {...props} />
}
