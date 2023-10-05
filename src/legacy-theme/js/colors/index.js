// /* eslint-disable no-invalid-this */
// /* eslint-disable camelcase */
// /* eslint-disable no-var */
// 'use strict'
// var __importDefault =
//   (this && this.__importDefault) ||
//   function (mod) {
//     return mod && mod.__esModule ? mod : {default: mod}
//   }
// Object.defineProperty(exports, '__esModule', {value: true})
// const light_1 = __importDefault(require('./light'))
// const light_high_contrast_1 = __importDefault(require('./light_high_contrast'))
// const light_colorblind_1 = __importDefault(require('./light_colorblind'))
// const light_tritanopia_1 = __importDefault(require('./light_tritanopia'))
// const dark_1 = __importDefault(require('./dark'))
// const dark_dimmed_1 = __importDefault(require('./dark_dimmed'))
// const dark_high_contrast_1 = __importDefault(require('./dark_high_contrast'))
// const dark_colorblind_1 = __importDefault(require('./dark_colorblind'))
// const dark_tritanopia_1 = __importDefault(require('./dark_tritanopia'))
// exports.default = {
//   light: light_1.default,
//   light_high_contrast: light_high_contrast_1.default,
//   light_colorblind: light_colorblind_1.default,
//   light_tritanopia: light_tritanopia_1.default,
//   dark: dark_1.default,
//   dark_dimmed: dark_dimmed_1.default,
//   dark_high_contrast: dark_high_contrast_1.default,
//   dark_colorblind: dark_colorblind_1.default,
//   dark_tritanopia: dark_tritanopia_1.default,
// }

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
