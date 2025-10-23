import light from './light'
import lightHighContrast from './light_high_contrast'
import lightColorblind from './light_colorblind'
import lightTritanopia from './light_tritanopia'
import dark from './dark'
import darkDimmed from './dark_dimmed'
import darkHighContrast from './dark_high_contrast'
import darkColorblind from './dark_colorblind'
import darkTritanopia from './dark_tritanopia'

export const colors = {
  light,
  // eslint-disable-next-line camelcase
  light_high_contrast: lightHighContrast,
  // eslint-disable-next-line camelcase
  light_colorblind: lightColorblind,
  // eslint-disable-next-line camelcase
  light_tritanopia: lightTritanopia,
  dark,
  dark_dimmed: darkDimmed,
  // eslint-disable-next-line camelcase
  dark_high_contrast: darkHighContrast,
  // eslint-disable-next-line camelcase
  dark_colorblind: darkColorblind,
  // eslint-disable-next-line camelcase
  dark_tritanopia: darkTritanopia,
}
