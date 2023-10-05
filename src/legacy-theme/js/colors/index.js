/* eslint-disable camelcase */
'use strict'

import light from './light'
import lightHighContrast from './light_high_contrast'
import lightColorblind from './light_colorblind'
import lightTritanopia from './light_tritanopia'
import dark from './dark'
import darkDimmed from './dark_dimmed'
import darkHighContrast from './dark_high_contrast'
import darkColorblind from './dark_colorblind'
import darkTritanopia from './dark_tritanopia'

export default {
  light,
  light_high_contrast: lightHighContrast,
  light_colorblind: lightColorblind,
  light_tritanopia: lightTritanopia,
  dark,
  dark_dimmed: darkDimmed,
  dark_high_contrast: darkHighContrast,
  dark_colorblind: darkColorblind,
  dark_tritanopia: darkTritanopia,
}
