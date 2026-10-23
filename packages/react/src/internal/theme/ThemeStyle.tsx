import React from 'react'
import {assertThemeDefinition, type ThemeDefinition, type ThemeColorScheme} from '../../experimental/defineTheme'
import {schemeTokens, typographyTokens} from './themeTokens'
import type {ThemeContextValue} from '../../ThemeContext'

function declarations(theme: ThemeDefinition, scheme: ThemeColorScheme) {
  const {body, heading, monospace} = theme.typography.fontFamily
  const values: Record<string, string> = {
    ...schemeTokens[scheme],
    ...typographyTokens,
    '--fontStack-system': body,
    '--fontStack-sansSerif': body,
    '--fontStack-sansSerifDisplay': heading,
    '--fontStack-monospace': monospace,
    '--text-title-shorthand-small': typographyTokens['--text-title-shorthand-small'].replace(
      'var(--fontStack-sansSerif)',
      'var(--fontStack-sansSerifDisplay)',
    ),
    '--borderRadius-small': theme.radii.small,
    '--borderRadius-medium': theme.radii.medium,
    '--borderRadius-large': theme.radii.large,
    // Overlay surfaces follow the product surface rather than a base ramp.
    '--overlay-bgColor': 'var(--bgColor-default)',
    '--overlay-borderColor': 'var(--borderColor-default)',
    'font-family': 'var(--fontStack-system)',
    color: 'var(--fgColor-default)',
  }
  const {tokens, components} = theme.colorSchemes[scheme]
  // Component exceptions are applied last so they win over shared roles.
  for (const [name, value] of [...Object.entries(tokens), ...Object.entries(components)]) {
    values[`--${name.replaceAll('.', '-')}`] = value
  }
  return Object.entries(values)
    .map(([name, value]) => `${name}:${value};`)
    .join('')
}

export function ThemeStyle({value, scope}: {value: ThemeContextValue; scope: string}) {
  const theme = value.themeDefinition
  if (!theme) return null
  assertThemeDefinition(theme)
  if (value.dayScheme !== 'light' || value.nightScheme !== 'dark') {
    throw new Error(
      'ThemeProvider: experimental theme identities currently support dayScheme="light" and nightScheme="dark" only.',
    )
  }
  const selector = `[data-primer-theme-scope="${scope}"]`
  const lightSelector = `${selector}[data-color-mode="light"][data-light-theme="light"]`
  const darkSelector = `${selector}[data-color-mode="dark"][data-dark-theme="dark"]`
  const autoLightSelector = `${selector}[data-color-mode="auto"][data-light-theme="light"]`
  const autoDarkSelector = `${selector}[data-color-mode="auto"][data-dark-theme="dark"]`
  const light = declarations(theme, 'light')
  const dark = declarations(theme, 'dark')
  const css =
    value.colorMode === 'auto'
      ? `${autoLightSelector}{${light}}@media(prefers-color-scheme:dark){${autoDarkSelector}{${dark}}}`
      : `${value.colorScheme === 'dark' ? darkSelector : lightSelector}{${value.colorScheme === 'dark' ? dark : light}}`
  return <style nonce={value.themeNonce} dangerouslySetInnerHTML={{__html: css}} />
}
