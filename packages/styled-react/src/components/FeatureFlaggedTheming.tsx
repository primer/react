import {
  ThemeProvider as PrimerReactThemeProvider,
  BaseStyles as PrimerReactBaseStyles,
  type BaseStylesProps,
  useTheme as primerReactUseTheme,
  useColorSchemeVar as primerReactUseColorSchemeVar,
} from '@primer/react'
import {
  ThemeProvider as StyledReactThemeProvider,
  useTheme as styledReactUseTheme,
  useColorSchemeVar as styledReactUseColorSchemeVar,
  type ThemeProviderProps,
} from './ThemeProvider'
import {BaseStyles as StyledReactBaseStyles} from './BaseStyles'
import {useFeatureFlag} from '@primer/react/experimental'

export const ThemeProvider: React.FC<React.PropsWithChildren<ThemeProviderProps>> = ({children, ...props}) => {
  const enabled = useFeatureFlag('primer_react_use_styled_react_theming')
  if (enabled) {
    return <StyledReactThemeProvider {...props}>{children}</StyledReactThemeProvider>
  } else {
    return <PrimerReactThemeProvider {...props}>{children}</PrimerReactThemeProvider>
  }
}

export const BaseStyles: React.FC<React.PropsWithChildren<BaseStylesProps>> = ({children, ...props}) => {
  const enabled = useFeatureFlag('primer_react_use_styled_react_theming')
  if (enabled) {
    return <StyledReactBaseStyles {...props}>{children}</StyledReactBaseStyles>
  } else {
    return <PrimerReactBaseStyles {...props}>{children}</PrimerReactBaseStyles>
  }
}

export const useTheme: typeof primerReactUseTheme = () => {
  const enabled = useFeatureFlag('primer_react_use_styled_react_theming')
  const styledReactResults = styledReactUseTheme()
  const primerReactResults = primerReactUseTheme()

  return enabled ? styledReactResults : primerReactResults
}

export const useColorSchemeVar: typeof primerReactUseColorSchemeVar = (values, fallback) => {
  const enabled = useFeatureFlag('primer_react_use_styled_react_theming')
  const styledReactResults = styledReactUseColorSchemeVar(values, fallback)
  const primerReactResults = primerReactUseColorSchemeVar(values, fallback)

  return enabled ? styledReactResults : primerReactResults
}

export type {ThemeProviderProps}
