// @preval
// This file needs to be a JavaScript file using CommonJS to be compatiable with preval

const {default: primitives} = require('@primer/primitives')
const {filterObject, isShadowValue, isColorValue, fontStack} = require('./utils/theme')

const {lineHeight: lineHeights} = primitives.typography.normal

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


const {scale: _excludeScaleColors, ...colors} = filterObject(primitives.colors.light, value =>
  isColorValue(value)
)
const {scale: _excludeScaleShadows, ...shadows} = filterObject(primitives.colors.light, value =>
  isShadowValue(value)
)

// this is a small hack that is a temporary stop gap.
// this file must be in vanilla JS to work with preval
// but our temporary filter utils make it impossible for
// our TypeScript to properly infer const object structure.
// shallow merging primitives objects back in restores the
// structural inferences and ultimately gets overrideen with
// the filtered values.
const typedColors = {...primitives.colors.light, ...colors};
const typedShadows = {...primitives.colors.light, ...shadows};
// ---------

const theme = {
  // General
  borderWidths,
  breakpoints,
  colors: typedColors,
  fonts,
  fontSizes,
  fontWeights,
  lineHeights,
  radii,
  shadows: typedShadows,
  sizes,
  space,
}

module.exports = {
  theme,
  colors
}
