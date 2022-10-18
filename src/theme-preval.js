// @preval
// This file needs to be a JavaScript file using CommonJS to be compatible with preval
// Cache bust: 2022-10-17 12:00:00 GMT (This file is cached by our deployment tooling, update this timestamp to rebuild this file)

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

const space = ['0', '4px', '8px', '16px', '24px', '32px', '40px', '48px', '64px', '80px', '96px', '112px', '128px']

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
