// @preval
// This file needs to be a JavaScript file using CommonJS to be compatiable with preval.

// This is a temporary theme file used to allow us to preview components in dark mode
// on the docs site. We'll remove this file when we have a more robust way to create themes.

const {theme: lightTheme} = require('./theme-preval')
const {default: primitives} = require('@primer/primitives')
const deepmerge = require('deepmerge')
const {filterObject, isShadowValue, isColorValue} = require('./utils/theme')

const {scale: _excludeScaleColors, ...functionalColors} = filterObject(primitives.colors.dark, value =>
  isColorValue(value)
)
const {scale: _excludeScaleShadows, ...functionalShadows} = filterObject(primitives.colors.dark, value =>
  isShadowValue(value)
)

const mergedColors = deepmerge(lightTheme.colors, functionalColors)
const mergedShadows = deepmerge(lightTheme.shadows, functionalShadows)

const theme = {
  ...lightTheme,
  colors: mergedColors,
  shadows: mergedShadows
}

module.exports = {theme}
