import sources from './PlaygroundAppearance.sources.json'
import brands from './PlaygroundAppearance.brands.json'

export const playgroundDensities = [
  {id: 'very-compact', name: 'Very compact', offset: -2},
  {id: 'compact', name: 'Compact', offset: -1},
  {id: 'default', name: 'Default', offset: 0},
  {id: 'spacious', name: 'Spacious', offset: 1},
  {id: 'very-spacious', name: 'Very spacious', offset: 2},
] as const

export type PlaygroundDensity = (typeof playgroundDensities)[number]['id']

interface PlaygroundPalette {
  id: string
  name: string
  mode: 'light' | 'dark'
  background: string
  surface: string
  inset: string
  hover: string
  foreground: string
  surfaceForeground: string
  insetForeground: string
  inputBackground: string
  inputForeground: string
  buttonBackground: string
  buttonForeground: string
  muted: string
  border: string
  accent: string
  success: string
  attention: string
  danger: string
  done: string
  preset?: 'windows95' | 'terminal'
  variables?: Readonly<Record<string, string>>
  source: ({repository: string; revision: string; path: string} | {title: string; url: string; retrievedAt: string}) & {
    license: string
    notes?: string
    references?: readonly string[]
  }
}

const windows95 = {
  white: '#FFFFFF',
  black: '#000000',
  gray100: '#DEDEDE',
  gray200: '#C3C3C3',
  gray300: '#808080',
  blue: '#0F0086',
  teal: '#008080',
  yellow: '#FFFF00',
  red: '#800000',
}

export const playgroundPalettes: readonly PlaygroundPalette[] = [
  ...[...sources.palettes, ...brands.palettes].map(
    (snapshot): PlaygroundPalette => ({
      id: snapshot.id,
      name: snapshot.name,
      mode: snapshot.mode === 'light' ? 'light' : 'dark',
      preset: snapshot.id === 'joelcaraballo-dark-green-hacker-color-theme' ? 'terminal' : undefined,
      ...snapshot.colors,
      variables: 'variables' in snapshot ? snapshot.variables : undefined,
      source: snapshot.source,
    }),
  ),
  {
    id: 'glass-ui',
    name: 'Glass UI',
    mode: 'light',
    background: '#edf2fa',
    surface: '#ffffffb8',
    inset: '#dce7f5a6',
    hover: '#ffffffeb',
    foreground: '#172438',
    surfaceForeground: '#172438',
    insetForeground: '#172438',
    inputBackground: '#ffffffcc',
    inputForeground: '#172438',
    buttonBackground: '#0062cc',
    buttonForeground: '#ffffff',
    muted: '#4f6077',
    border: '#a9bbd2',
    accent: '#005bbf',
    success: '#167342',
    attention: '#855800',
    danger: '#bd293a',
    done: '#7143b5',
    variables: {
      '--fontStack-system': "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', sans-serif",
      '--fontStack-sansSerif': 'var(--fontStack-system)',
      '--fontStack-sansSerifDisplay': "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif",
      '--text-title-weight-small': '600',
      '--text-title-weight-medium': '600',
      '--text-title-weight-large': '600',
      '--borderRadius-default': '16px',
      '--borderRadius-small': '8px',
      '--borderRadius-medium': '16px',
      '--borderRadius-large': '24px',
      '--overlay-bgColor': '#f8fafffa',
      '--overlay-borderColor': '#ffffffeb',
      '--overlay-backdrop-bgColor': '#162d4d33',
      '--control-borderColor-rest': '#71849d',
      '--control-borderColor-hover': '#4f6077',
      '--button-default-bgColor-rest': '#ffffffa6',
      '--button-default-bgColor-hover': '#ffffffeb',
      '--button-default-bgColor-active': '#dce7f5e6',
      '--button-default-bgColor-selected': '#dce7f5e6',
      '--button-default-borderColor-rest': '#ffffffeb',
      '--button-default-borderColor-hover': '#b1c6e0',
      '--button-default-borderColor-active': '#71849d',
      '--button-primary-bgColor-hover': '#0056b8',
      '--button-primary-bgColor-active': '#004b9f',
      '--button-primary-borderColor-hover': '#0056b8',
      '--shadow-inset': 'inset 0 1px 2px #203b6412, inset 0 -1px 0 #ffffffcc',
      '--button-default-shadow-resting': 'inset 0 1px 0 #ffffff, inset 0 -1px 0 #c4d4e54d, 0 2px 6px #203b6414',
      '--shadow-resting-xsmall': 'inset 0 1px 0 #ffffffb3, 0 1px 3px #203b6414',
      '--shadow-resting-small': 'inset 0 1px 0 #ffffff66, 0 2px 8px #203b6426',
      '--shadow-resting-medium': 'inset 0 1px 0 #ffffffcc, 0 6px 20px #203b641a',
      '--shadow-floating-small': 'inset 0 1px 0 #ffffff, 0 4px 16px #203b6426, 0 0 0 1px #ffffffb3',
      '--shadow-floating-medium': 'inset 0 1px 0 #ffffff, 0 8px 32px #203b6426, 0 0 0 1px #ffffffb3',
      '--shadow-floating-large': 'inset 0 1px 0 #ffffff, 0 16px 48px #203b642e, 0 0 0 1px #ffffffb3',
      '--shadow-floating-xlarge': 'inset 0 1px 0 #ffffff, 0 24px 64px #203b6433, 0 0 0 1px #ffffffb3',
      '--button-primary-shadow-selected': 'inset 0 2px 5px #002b6666, inset 0 1px 0 #ffffff33',
      '--button-danger-shadow-selected': 'inset 0 2px 5px #58253333',
      '--button-outline-shadow-selected': 'inset 0 2px 5px #203b6426',
    },
    source: {
      title: 'Apple HIG Materials (inspiration)',
      url: 'https://developer.apple.com/design/human-interface-guidelines/materials',
      retrievedAt: '2026-10-28',
      license: 'Original playground preset; no Apple code, stylesheets or font assets redistributed',
      notes:
        'An original interpretation, not Apple design tokens or a Liquid Glass replica. Translucent control fills, highlight shadows and rounded primitives suggest glass while content remains opaque and popovers nearly opaque for legibility. No backdrop blur or optical refraction; font stacks use locally available system fonts.',
    },
  },
  {
    id: 'windows-95',
    name: 'Windows 95 (95CSS)',
    mode: 'light',
    preset: 'windows95',
    background: windows95.gray200,
    surface: windows95.gray100,
    inset: windows95.gray200,
    hover: windows95.gray100,
    foreground: windows95.black,
    surfaceForeground: windows95.black,
    insetForeground: windows95.black,
    inputBackground: windows95.white,
    inputForeground: windows95.black,
    buttonBackground: windows95.blue,
    buttonForeground: windows95.white,
    muted: windows95.gray300,
    border: windows95.gray300,
    accent: windows95.blue,
    success: windows95.teal,
    attention: windows95.yellow,
    danger: windows95.red,
    done: windows95.blue,
    source: {
      repository: 'YoshiMannaert/95CSS',
      revision: 'baa76e053b8fd37895ba66714e1fb9effd55bd8a',
      path: 'css/95css.css',
      license: 'MIT; W95FA font: SIL OFL-1.1',
    },
  },
]

const spacingSteps = [2, 4, 6, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 64, 80, 96, 112, 128]
const controlSteps = [
  {name: 'xsmall', size: 24, paddingBlock: 2, condensed: 4, normal: 8, spacious: 12, gap: 4},
  {name: 'small', size: 28, paddingBlock: 4, condensed: 8, normal: 12, spacious: 16, gap: 4},
  {name: 'medium', size: 32, paddingBlock: 6, condensed: 8, normal: 12, spacious: 16, gap: 8},
  {name: 'large', size: 40, paddingBlock: 10, condensed: 8, normal: 12, spacious: 16, gap: 8},
  {name: 'xlarge', size: 48, paddingBlock: 14, condensed: 8, normal: 12, spacious: 16, gap: 8},
]

export function densityVariables(density: PlaygroundDensity): Record<string, string> {
  const preset = playgroundDensities.find(value => value.id === density)
  if (!preset) throw new Error(`Unknown playground density: ${density}`)
  const {offset} = preset
  if (offset === 0) return {}
  const result: Record<string, string> = {}
  const rem = (pixels: number) => `${pixels / 16}rem`
  for (const [index, size] of spacingSteps.entries()) {
    const shifted = spacingSteps[Math.max(0, Math.min(spacingSteps.length - 1, index + offset))]
    result[`--base-size-${size}`] = rem(shifted)
    result[`--base-size-negative-${size}`] = rem(-shifted)
  }
  for (const [variant, size] of [
    ['condensed', 8],
    ['normal', 16],
    ['spacious', 24],
  ] as const) {
    result[`--stack-padding-${variant}`] = `var(--base-size-${size})`
    result[`--stack-gap-${variant}`] = `var(--base-size-${size})`
  }
  for (const [index, control] of controlSteps.entries()) {
    const shifted = controlSteps[Math.max(0, Math.min(controlSteps.length - 1, index + offset))]
    const prefix = `--control-${control.name}`
    result[`${prefix}-size`] = rem(shifted.size)
    result[`${prefix}-paddingBlock`] = rem(shifted.paddingBlock)
    result[`${prefix}-gap`] = rem(shifted.gap)
    result[`${prefix}-paddingInline-condensed`] = rem(shifted.condensed)
    result[`${prefix}-paddingInline-normal`] = rem(shifted.normal)
    result[`${prefix}-paddingInline-spacious`] = rem(shifted.spacious)
  }
  result['--ActionList--leadingVisual-iconSize'] = 'max(1rem, var(--base-size-16))'
  result['--ActionList--visual-minHeight'] = 'max(1.25rem, var(--base-size-20))'
  return result
}

function compositeColor(hex: string, canvas: readonly number[] = [255, 255, 255]) {
  const raw = hex.slice(1)
  const expanded = raw.length <= 4 ? [...raw].map(channel => channel + channel).join('') : raw
  const alpha = expanded.length === 8 ? Number.parseInt(expanded.slice(6), 16) / 255 : 1
  return [0, 2, 4].map((start, index) => {
    return Number.parseInt(expanded.slice(start, start + 2), 16) * alpha + canvas[index] * (1 - alpha)
  })
}

function luminance(rgb: readonly number[]) {
  const channels = rgb.map(channel => {
    const value = channel / 255
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  })
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722
}

function contrastText(background: string, canvas?: string) {
  const value = luminance(compositeColor(background, canvas ? compositeColor(canvas) : undefined))
  return (value + 0.05) / 0.05 >= 1.05 / (value + 0.05) ? '#000000' : '#ffffff'
}

function readableColor(color: string, background: string, canvas?: string) {
  const backdrop = compositeColor(background, canvas ? compositeColor(canvas) : undefined)
  const foreground = luminance(compositeColor(color, backdrop))
  const behind = luminance(backdrop)
  const contrast = (Math.max(foreground, behind) + 0.05) / (Math.min(foreground, behind) + 0.05)
  return contrast >= 4.5 ? color : contrastText(background, canvas)
}

function translucent(color: string, percentage: number) {
  return `color-mix(in srgb, ${color} ${percentage}%, transparent)`
}

export function paletteVariables(palette: PlaygroundPalette | undefined): Record<string, string> {
  if (!palette) return {}
  const {background, surface, inset, hover, border, accent, buttonBackground} = palette
  const foreground = readableColor(palette.foreground, background)
  const muted = readableColor(palette.muted, background)
  const surfaceForeground = readableColor(palette.surfaceForeground, surface, background)
  const onAccent = contrastText(accent, background)
  const onPrimary = readableColor(palette.buttonForeground, buttonBackground, background)
  const link = readableColor(accent, background)
  const result: Record<string, string> = {
    '--bgColor-default': background,
    '--bgColor-muted': surface,
    '--bgColor-inset': inset,
    '--bgColor-emphasis': foreground,
    '--bgColor-disabled': surface,
    '--fgColor-default': foreground,
    '--fgColor-muted': muted,
    '--fgColor-disabled': muted,
    '--fgColor-onEmphasis': contrastText(foreground, background),
    '--fgColor-link': link,
    '--borderColor-default': border,
    '--borderColor-muted': translucent(border, 60),
    '--borderColor-emphasis': muted,
    '--borderColor-disabled': translucent(border, 60),
    '--overlay-bgColor': surface,
    '--overlay-borderColor': border,
    '--header-bgColor': inset,
    '--header-fgColor-default': readableColor(palette.insetForeground, inset, background),
    '--header-fgColor-logo': readableColor(palette.insetForeground, inset, background),
    '--header-borderColor-divider': border,
    '--focus-outlineColor': accent,
    '--selection-bgColor': translucent(accent, 25),
    '--control-bgColor-rest': palette.inputBackground,
    '--control-bgColor-hover': surface,
    '--control-bgColor-active': hover,
    '--control-bgColor-disabled': surface,
    '--control-fgColor-rest': readableColor(palette.inputForeground, palette.inputBackground, background),
    '--control-fgColor-placeholder': muted,
    '--control-fgColor-disabled': muted,
    '--control-borderColor-rest': border,
    '--control-borderColor-hover': muted,
    '--control-borderColor-active': accent,
    '--control-borderColor-disabled': translucent(border, 60),
    '--control-transparent-bgColor-rest': 'transparent',
    '--control-transparent-bgColor-hover': translucent(foreground, 8),
    '--control-transparent-bgColor-active': translucent(foreground, 13),
    '--control-transparent-bgColor-selected': translucent(accent, 15),
    '--control-transparent-borderColor-rest': 'transparent',
    '--control-transparent-borderColor-active': accent,
    '--button-default-bgColor-rest': surface,
    '--button-default-bgColor-hover': hover,
    '--button-default-bgColor-active': hover,
    '--button-default-bgColor-selected': hover,
    '--button-default-bgColor-disabled': surface,
    '--button-default-borderColor-rest': border,
    '--button-default-borderColor-hover': muted,
    '--button-default-borderColor-active': accent,
    '--button-default-borderColor-disabled': translucent(border, 60),
    '--button-default-fgColor-rest': surfaceForeground,
    '--button-invisible-bgColor-hover': translucent(foreground, 8),
    '--button-invisible-bgColor-active': translucent(foreground, 13),
    '--button-invisible-iconColor-rest': muted,
    '--button-invisible-iconColor-hover': foreground,
    '--button-primary-bgColor-rest': buttonBackground,
    '--button-primary-bgColor-hover': buttonBackground,
    '--button-primary-bgColor-active': buttonBackground,
    '--button-primary-bgColor-disabled': translucent(buttonBackground, 40),
    '--button-primary-fgColor-rest': onPrimary,
    '--button-primary-fgColor-disabled': onPrimary,
    '--button-primary-borderColor-rest': buttonBackground,
    '--button-primary-borderColor-hover': buttonBackground,
    '--buttonCounter-default-bgColor-rest': translucent(surfaceForeground, 9),
    '--buttonCounter-default-fgColor-rest': surfaceForeground,
    '--buttonCounter-primary-bgColor-rest': translucent(onPrimary, 13),
    '--buttonCounter-primary-fgColor-rest': onPrimary,
    '--buttonCounter-invisible-bgColor-rest': translucent(foreground, 9),
    '--buttonCounter-invisible-fgColor-rest': foreground,
    '--buttonCounter-outline-bgColor-rest': translucent(accent, 13),
    '--buttonCounter-outline-fgColor-rest': link,
    '--underlineNav-borderColor-active': accent,
    '--underlineNav-iconColor-rest': muted,
    '--underlineNav-iconColor-hover': foreground,
    '--counter-bgColor-muted': translucent(foreground, 9),
    '--counter-fgColor': foreground,
    '--color-canvas-default': background,
    '--color-canvas-subtle': surface,
    '--color-canvas-inset': inset,
    '--color-fg-default': foreground,
    '--color-fg-muted': muted,
    '--color-border-default': border,
    '--color-border-muted': translucent(border, 60),
    '--color-accent-fg': link,
  }
  for (const [role, color] of Object.entries({
    accent,
    neutral: muted,
    success: palette.success,
    attention: palette.attention,
    danger: palette.danger,
    severe: palette.danger,
    done: palette.done,
    upsell: palette.done,
    open: palette.success,
    closed: palette.done,
  })) {
    result[`--fgColor-${role}`] = readableColor(color, background)
    result[`--bgColor-${role}-muted`] = translucent(color, 13)
    result[`--bgColor-${role}-emphasis`] = color
    result[`--borderColor-${role}-muted`] = translucent(color, 40)
    result[`--borderColor-${role}-emphasis`] = color
  }
  for (const state of ['rest', 'hover', 'active', 'disabled']) {
    result[`--control-checked-bgColor-${state}`] = accent
    result[`--control-checked-borderColor-${state}`] = accent
    result[`--control-checked-fgColor-${state}`] = onAccent
    result[`--button-danger-fgColor-${state}`] = readableColor(palette.danger, surface, background)
    result[`--button-outline-fgColor-${state}`] = link
  }
  if (palette.preset === 'windows95') Object.assign(result, windows95Variables())
  if (palette.preset === 'terminal') Object.assign(result, terminalVariables(palette))
  if (palette.variables) Object.assign(result, typographyVariables(), palette.variables)
  return result
}

function terminalVariables(palette: PlaygroundPalette): Record<string, string> {
  const border = `color-mix(in srgb, ${palette.accent} 40%, ${palette.border})`
  const result: Record<string, string> = {
    '--fontStack-system': 'var(--fontStack-monospace)',
    '--fontStack-sansSerif': 'var(--fontStack-monospace)',
    '--fontStack-sansSerifDisplay': 'var(--fontStack-monospace)',
    '--borderColor-default': border,
    '--borderColor-muted': border,
    '--overlay-borderColor': border,
    '--header-borderColor-divider': border,
    '--control-borderColor-rest': border,
    '--button-default-borderColor-rest': border,
    '--color-border-default': border,
    '--color-border-muted': border,
    '--shadow-inset': 'none',
    '--shadow-resting-xsmall': 'none',
    '--shadow-resting-small': 'none',
    '--shadow-resting-medium': 'none',
    '--button-default-shadow-resting': 'none',
    '--button-primary-shadow-selected': 'none',
    '--button-danger-shadow-selected': 'none',
    '--button-outline-shadow-selected': 'none',
  }
  for (const size of ['default', 'small', 'medium', 'large']) {
    result[`--borderRadius-${size}`] = '0'
  }
  for (const size of ['small', 'medium', 'large', 'xlarge']) {
    result[`--shadow-floating-${size}`] = '0 0 0 var(--borderWidth-thin) var(--borderColor-default)'
  }
  return {...result, ...typographyVariables()}
}

function typographyVariables(): Record<string, string> {
  // Inherited shorthands have already resolved their font references outside the preview scope.
  const result: Record<string, string> = {}
  for (const role of ['caption', 'subtitle', 'display']) {
    result[`--text-${role}-shorthand`] =
      `var(--text-${role}-weight) var(--text-${role}-size) / var(--text-${role}-lineHeight) var(--fontStack-system)`
  }
  for (const size of ['small', 'medium', 'large']) {
    result[`--text-body-shorthand-${size}`] =
      `var(--text-body-weight) var(--text-body-size-${size}) / var(--text-body-lineHeight-${size}) var(--fontStack-system)`
    result[`--text-title-shorthand-${size}`] =
      `var(--text-title-weight-${size}) var(--text-title-size-${size}) / var(--text-title-lineHeight-${size}) var(--fontStack-system)`
  }
  return result
}

function windows95Variables(): Record<string, string> {
  const {white, black, gray100, gray200, gray300, teal} = windows95
  const raised = `inset -2px -2px 0 ${black}, inset 2px 2px 0 ${white}, inset -4px -4px 0 ${gray300}, inset 4px 4px 0 ${gray100}`
  const sunken = `inset -2px -2px 0 ${white}, inset 2px 2px 0 ${black}, inset -4px -4px 0 ${gray100}, inset 4px 4px 0 ${gray300}`
  const input = `inset -2px -2px 0 ${white}, inset 2px 2px 0 ${gray300}, inset -4px -4px 0 ${gray200}, inset 4px 4px 0 ${black}`
  const dialog = `inset -2px -2px 0 ${black}, inset 2px 2px 0 ${gray100}, inset -4px -4px 0 ${gray300}, inset 4px 4px 0 ${white}`
  const font = '"Playground W95FA", "MS Sans Serif", Tahoma, sans-serif'
  const result: Record<string, string> = {
    '--playground-desktop-bgColor': teal,
    '--fontStack-system': font,
    '--fontStack-sansSerif': font,
    '--fontStack-sansSerifDisplay': font,
    '--fontStack-monospace': '"Courier New", monospace',
    '--text-caption-shorthand':
      '400 var(--text-body-size-small) / var(--text-body-lineHeight-small) var(--fontStack-system)',
    '--text-subtitle-shorthand': '400 1.25rem / 1.625 var(--fontStack-system)',
    '--text-display-shorthand': '500 2.5rem / 1.375 var(--fontStack-system)',
    '--text-codeBlock-shorthand': '400 0.8125rem / 1.5 var(--fontStack-monospace)',
    '--text-codeInline-shorthand': '400 0.9285em var(--fontStack-monospace)',
    '--button-default-bgColor-rest': gray200,
    '--button-default-bgColor-hover': gray200,
    '--button-default-bgColor-active': gray200,
    '--button-default-borderColor-rest': 'transparent',
    '--button-default-borderColor-hover': 'transparent',
    '--button-default-borderColor-active': 'transparent',
    '--button-default-shadow-resting': raised,
    '--button-primary-shadow-selected': sunken,
    '--button-danger-shadow-selected': sunken,
    '--shadow-inset': input,
    '--shadow-resting-xsmall': raised,
    '--shadow-resting-small': raised,
    '--shadow-resting-medium': raised,
    '--shadow-floating-small': dialog,
    '--shadow-floating-medium': dialog,
    '--shadow-floating-large': dialog,
    '--shadow-floating-xlarge': dialog,
    '--borderWidth-thin': '1px',
    '--borderWidth-thick': '2px',
  }
  for (const size of ['default', 'small', 'medium', 'large', 'full']) {
    result[`--borderRadius-${size}`] = '0'
  }
  for (const [size, pixels, lineHeight] of [
    ['small', 16, 1.25],
    ['medium', 18, 20 / 18],
    ['large', 20, 1.2],
  ] as const) {
    result[`--text-body-size-${size}`] = `${pixels / 16}rem`
    result[`--text-body-lineHeight-${size}`] = `${lineHeight}`
    result[`--text-body-shorthand-${size}`] =
      `400 var(--text-body-size-${size}) / var(--text-body-lineHeight-${size}) var(--fontStack-system)`
    result[`--text-title-shorthand-${size}`] =
      `700 var(--text-title-size-${size}) / var(--text-title-lineHeight-${size}) var(--fontStack-system)`
  }
  return result
}
