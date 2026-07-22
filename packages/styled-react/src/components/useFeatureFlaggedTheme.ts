import {useColorSchemeVar as primerUseColorSchemeVar, useTheme as primerUseTheme} from '@primer/react'
import {useFeatureFlag} from '@primer/react/experimental'
import {useColorSchemeVar as styledUseColorSchemeVar, useTheme as styledUseTheme} from './useTheme'

export function useTheme(): ReturnType<typeof styledUseTheme> {
  const enabled = useFeatureFlag('primer_react_styled_react_use_primer_theme_providers')
  const styledTheme = styledUseTheme()
  const primerTheme = primerUseTheme()
  if (enabled) {
    return primerTheme as ReturnType<typeof styledUseTheme>
  }
  return styledTheme
}

export function useColorSchemeVar(values: Partial<Record<string, string>>, fallback: string) {
  const enabled = useFeatureFlag('primer_react_styled_react_use_primer_theme_providers')
  const styledValue = styledUseColorSchemeVar(values, fallback)
  const primerValue = primerUseColorSchemeVar(values, fallback)
  return enabled ? primerValue : styledValue
}
