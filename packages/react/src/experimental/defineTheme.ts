import {colorTokens} from '../internal/theme/themeTokens'

export type ThemeColorToken = (typeof colorTokens)[number]
export type ThemeColorScheme = 'light' | 'dark'

export interface ThemeDefinition {
  readonly name: string
  readonly typography: {
    readonly fontFamily: Readonly<Record<'body' | 'heading' | 'monospace', string>>
  }
  readonly radii: Readonly<Record<'small' | 'medium' | 'large', string>>
  readonly colorSchemes: Readonly<
    Record<ThemeColorScheme, {readonly tokens: Readonly<Partial<Record<ThemeColorToken, string>>>}>
  >
}

export interface ThemeDefinitionOptions {
  name: string
  extends?: ThemeDefinition
  typography?: {fontFamily?: Partial<ThemeDefinition['typography']['fontFamily']>}
  radii?: Partial<ThemeDefinition['radii']>
  colorSchemes?: Partial<Record<ThemeColorScheme, {tokens: Partial<Record<ThemeColorToken, string>>}>>
}

const definitions = new WeakSet<ThemeDefinition>()

export const primerTheme: ThemeDefinition = Object.freeze({
  name: 'primer',
  typography: Object.freeze({
    fontFamily: Object.freeze({
      body: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
      heading:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
      monospace: 'ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace',
    }),
  }),
  radii: Object.freeze({small: '3px', medium: '6px', large: '12px'}),
  colorSchemes: Object.freeze({
    light: Object.freeze({tokens: Object.freeze({})}),
    dark: Object.freeze({tokens: Object.freeze({})}),
  }),
})
definitions.add(primerTheme)

export function assertThemeDefinition(theme: ThemeDefinition): void {
  if (!definitions.has(theme)) throw new Error('ThemeProvider: create themes with defineTheme().')
}

function assertKeys(value: object, keys: readonly string[], label: string) {
  if (typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`defineTheme: ${label} must be an object.`)
  }
  // JavaScript callers can pass null even though the public type excludes it.
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (value === null) throw new Error(`defineTheme: ${label} must be an object.`)
  for (const key of Object.keys(value)) {
    if (!keys.includes(key)) throw new Error(`defineTheme: unknown ${label} "${key}".`)
  }
}

function assertOptionalKeys(value: object | undefined, keys: readonly string[], label: string) {
  if (value !== undefined) assertKeys(value, keys, label)
}

/**
 * Defines an experimental CSS theme identity. Missing inputs inherit from the
 * explicit base, not from an enclosing provider.
 */
export function defineTheme(options: ThemeDefinitionOptions): ThemeDefinition {
  assertKeys(options, ['name', 'extends', 'typography', 'radii', 'colorSchemes'], 'option')
  if (typeof options.name !== 'string' || !/^[a-z][a-z0-9-]*$/.test(options.name))
    throw new Error('defineTheme: name must be a lowercase CSS identifier.')
  const base = options.extends === undefined ? primerTheme : options.extends
  assertThemeDefinition(base)
  assertOptionalKeys(options.typography, ['fontFamily'], 'typography option')
  assertOptionalKeys(options.typography?.fontFamily, ['body', 'heading', 'monospace'], 'font family')
  assertOptionalKeys(options.radii, ['small', 'medium', 'large'], 'radius')
  assertOptionalKeys(options.colorSchemes, ['light', 'dark'], 'color scheme')
  const fontFamily = {...base.typography.fontFamily, ...options.typography?.fontFamily}
  for (const value of Object.values(fontFamily)) {
    if (typeof value !== 'string' || !value.trim() || /[;{}<>\\()]|\/\*/.test(value)) {
      throw new Error('defineTheme: font families must be nonempty, literal CSS font stacks.')
    }
  }
  const radii = {...base.radii, ...options.radii}
  for (const value of Object.values(radii)) {
    if (typeof value !== 'string' || !/^(?:0|(?:\d+(?:\.\d+)?)(?:px|rem))$/.test(value)) {
      throw new Error('defineTheme: radii must be nonnegative px or rem lengths, or 0.')
    }
  }
  function scheme(name: ThemeColorScheme) {
    const input = options.colorSchemes?.[name]
    assertOptionalKeys(input, ['tokens'], 'color scheme option')
    assertOptionalKeys(input?.tokens, colorTokens, 'color token')
    const tokens = {...base.colorSchemes[name].tokens, ...input?.tokens}
    for (const value of Object.values(tokens)) {
      if (typeof value !== 'string' || !/^#[\da-f]{6}$/i.test(value)) {
        throw new Error('defineTheme: colors must be opaque six-digit hex values.')
      }
    }
    return Object.freeze({tokens: Object.freeze(tokens)})
  }
  const theme = Object.freeze({
    name: options.name,
    typography: Object.freeze({fontFamily: Object.freeze(fontFamily)}),
    radii: Object.freeze(radii),
    colorSchemes: Object.freeze({light: scheme('light'), dark: scheme('dark')}),
  })
  definitions.add(theme)
  return theme
}
