// @ts-check
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
 * @type {Omit<typeof light['colors'], 'scale'>}
 */
const lightColors = omitScale(light.colors)

/**
 * @type {Omit<typeof light['shadows'], 'scale'>}
 */
const lightShadows = omitScale(light.shadows)

/**
 * @type {Omit<typeof dark['colors'], 'scale'>}
 */
const darkColors = omitScale(dark.colors)

/**
 * @type {Omit<typeof dark['shadows'], 'scale'>}
 */
const darkShadows = omitScale(dark.shadows)

/**
 * @type {Omit<typeof darkDimmed['colors'], 'scale'>}
 */
const darkDimmedColors = omitScale(darkDimmed.colors)

/**
 * @type {Omit<typeof darkDimmed['shadows'], 'scale'>}
 */
const darkDimmedShadows = omitScale(darkDimmed.shadows)

/**
 * @todo are these types all correct - especially the partial colors from
 * primitives?  if not - let's tighten that up!
 *
 * @typedef {Object} ThemePrevalType
 * @property {{easeOutCubic: string}} animation
 * @property {ReadonlyArray<string | number>} borderWidths
 * @property {ReadonlyArray<string>} breakpoints
 * @property {{normal: string; mono: string}} fonts
 * @property {ReadonlyArray<string>} fontSizes
 * @property {Record<'light' | 'normal' | 'semibold' | 'bold', number>} fontWeights
 * @property {Record<'condensedUltra' | 'condensed' | 'default', number>} lineHeights
 * @property {ReadonlyArray<string>} radii
 * @property {Record<'small' | 'medium' | 'large' | 'xlarge', string>} sizes
 * @property {ReadonlyArray<string>} space
 * @property {{
 *   light: {
 *      colors: typeof lightColors,
 *      shadows: typeof lightShadows
 *   },
 *   dark: {
 *      colors: typeof darkColors,
 *      shadows: typeof darkShadows
 *   },
 *   dark_dimmed: {
 *      colors: typeof darkDimmedColors,
 *      shadows: typeof darkDimmedShadows
 *   },
 *   [x: string]: {
 *      colors: typeof darkDimmedColors,
 *      shadows: typeof darkDimmedShadows
 *   }
 * }} colorSchemes
 */

/**
 * @type {Readonly<ThemePrevalType>}
 */
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
