// This is a temporary theme file used to allow us to preview components in dark mode
// on the docs site. We'll remove this file when we have a more robust way to create themes.

import {theme as lightTheme} from './theme-preval'
import {default as primitives} from '@primer/primitives'
import deepmerge from 'deepmerge'
import {filterObject, isShadowValue, isColorValue} from './utils/theme'

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
} as const

module.exports = {theme}
