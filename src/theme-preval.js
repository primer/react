// @preval
// This file needs to be a JavaScript file using CommonJS to be compatiable with preval

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

const light = partitionColors(primitives.colors.light)
const dark = partitionColors(primitives.colors.dark)
const darkDimmed = partitionColors(primitives.colors['dark_dimmed'])

// This file must be in vanilla JS to work with preval
// but our temporary filter utils make it impossible for
// our TypeScript to properly infer const object structure
// so we need to use JSDoc comments.

/**
 * @type Partial<typeof primitives.colors.light>
 */
const lightColors = omitScale(light.colors)

/**
 * @type Partial<typeof primitives.colors.light>
 */
const lightShadows = omitScale(light.shadows)

/**
 * @type Partial<typeof primitives.colors.dark>
 */
const darkColors = omitScale(dark.colors)

/**
 * @type Partial<typeof primitives.colors.dark>
 */
const darkShadows = omitScale(dark.shadows)

/**
 * @type Partial<typeof primitives.colors.dark_dimmed>
 */
const darkDimmedColors = omitScale(darkDimmed.colors)

/**
 * @type Partial<typeof primitives.colors.dark_dimmed>
 */
const darkDimmedShadows = omitScale(darkDimmed.shadows)

const theme = {
  // General
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
  colorSchemes: {
    light: {
      colors: lightColors,
      shadows: lightShadows
    },
    dark: {
      colors: darkColors,
      shadows: darkShadows
    },
    dark_dimmed: {
      colors: darkDimmedColors,
      shadows: darkDimmedShadows
    }
  }
}

module.exports = {
  theme
}
