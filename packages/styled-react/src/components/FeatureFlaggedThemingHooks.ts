import {useTheme as primerUseTheme} from '@primer/react'
import {useFeatureFlag} from '@primer/react/experimental'
import {useTheme as styledUseTheme, useColorSchemeVar} from './ThemeProviderContext'

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
