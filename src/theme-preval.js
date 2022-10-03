// @preval
// This file needs to be a JavaScript file using CommonJS to be compatible with preval
// Cache bust: 2022-07-25 12:00:00 GMT (This file is cached by our deployment tooling, update this timestamp to rebuild this file)

const {default: primitives} = require('@primer/primitives')
const {partitionColors, fontStack, omitScale} = require('./utils/theme')

const {lineHeight: lineHeights} = primitives.typography.normal

const animation = {
  easeOutCubic: 'cubic-bezier(0.33, 1, 0.68, 1)'
}

const breakpoints = ['544px', '768px', '1012px', '1280px']

const fonts = {
  normal: fontStack([
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Helvetica',
    'Arial',
    'sans-serif',
    'Apple Color Emoji',
    'Segoe UI Emoji'
  ]),
  mono: fontStack(['SFMono-Regular', 'Consolas', 'Liberation Mono', 'Menlo', 'Courier', 'monospace'])
}

const fontWeights = {
  light: 300,
  normal: 400,
  semibold: 500,
  bold: 600
}

const borderWidths = [0, '1px']

const radii = ['0', '3px', '6px', '100px']

const sizes = {
  small: '544px',
  medium: '768px',
  large: '1012px',
  xlarge: '1280px'
}

const fontSizes = ['12px', '14px', '16px', '20px', '24px', '32px', '40px', '48px']

// map existing values to primitives/tokens-v2-private with fallback
const space = [
  '0',
  'var(--base-size-4,4px)',
  'var(--base-size-8,8px)',
  'var(--base-size-16,16px)',
  'var(--base-size-24,24px)',
  'var(--base-size-32,32px)',
  'var(--base-size-40,40px)',
  'var(--base-size-48,48px)',
  'var(--base-size-64,64px)',
  'var(--base-size-80,80px)',
  'var(--base-size-96,96px)',
  'var(--base-size-112,112px)',
  'var(--base-size-128,128px)'
]

/**
 * @type Record<keyof typeof primitives.colors, Record<'colors' | 'shadows', Partial<typeof primitives.colors.light>>
 */
const colorSchemes = Object.entries(primitives.colors).reduce((acc, [name, variables]) => {
  const {colors, shadows} = partitionColors(variables)
  acc[name] = {
    colors: omitScale(colors),
    shadows: omitScale(shadows)
  }
  return acc
}, {})

const theme = {
  animation,
  borderWidths,
  breakpoints,
  fonts,
  fontSizes,
  fontWeights,
  lineHeights,
  radii,
  sizes,
  space,
  colorSchemes
}

module.exports = theme
