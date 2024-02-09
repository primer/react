import {getContrast} from 'color2k'
import {Hsluv} from 'hsluv'
import type {hexString} from '../utils/isHex'
import type {variantColor} from '../Token/IssueLabelToken'

/**
 * transforms a hex color provided by the user into a color object with background and text colors
 * @param colorHex — the hex color provided by the user
 * @param colorScheme — the color scheme the user has currently set
 * @param isSelected
 * @param bgColor — the background color from the selected theme, needed to calc the contrast for the colors
 * @returns
 */
export const getColorsFromHex = (colorHex: hexString, colorScheme = 'light', bgColor: string): variantColor => {
  // start values for light mode
  let bgLightness = 96
  let lightnessIncrement = -1
  let ratio = 4.5
  // start values for dark mode
  if (colorScheme.startsWith('dark')) {
    bgLightness = 16
    lightnessIncrement = 1
    ratio = 5.5
  }

  // get hue and saturation value from hex color
  // eslint-disable-next-line prefer-const
  let {h, s} = hexToHsluv(colorHex)

  // avoid intense bright colors
  if (h >= 58 && h <= 198 && s > 70) {
    s = 70
  }
  /**
   * creating a background color from the provided hex color
   */
  const {colorHex: backgroundColor, lightness: currentBgLightness} = getColorWithContrast(
    hsluvToHex({h, s, l: bgLightness}),
    bgColor,
    1.2,
    lightnessIncrement as 1 | -1,
  )

  // avoid intense bright colors
  if (h >= 58 && h <= 316 && s > 80) {
    s = 80
  }
  /**
   * creating a text color from with a contrast ratio of at least 4.5 to the generated background color
   */
  const {colorHex: textColor} = getColorWithContrast(
    hsluvToHex({h, s, l: 50}),
    backgroundColor,
    ratio,
    lightnessIncrement as 1 | -1,
  )

  return {
    backgroundColor,
    textColor,
    backgroundColorHover: hsluvToHex({h, s, l: currentBgLightness + 4 * lightnessIncrement}),
    backgroundColorPressed: hsluvToHex({h, s, l: currentBgLightness + 8 * lightnessIncrement}),
  }
}
/**
 * Changes the lightness of a hex color until the contrast ratio is reached and returns the new hex color
 * @param colorHex — initial hex color
 * @param bgHex — color to check the contrast against
 * @param contrastRatio — the contrast ratio to reach
 * @param increment — the direction to change the lightness depending on the color scheme
 * @returns the new hex color
 */
const getColorWithContrast = (
  colorHex: hexString,
  bgHex: string,
  contrastRatio: number,
  increment: 1 | -1,
): {colorHex: hexString; lightness: number} => {
  // deconstruct color
  const hsluv = hexToHsluv(colorHex)
  let {l: lightness} = hsluv
  const {h, s} = hsluv
  // change lightness until contrast is reached
  while (getContrast(colorHex, bgHex) < contrastRatio && lightness > 0 && lightness < 100) {
    lightness += increment
    colorHex = hsluvToHex({h, s, l: lightness})
  }
  // return hex color and ligthness
  return {colorHex, lightness}
}

/**
 * Takes a hex value and returns the hue, saturation and lightness for HSLuv as an object
 * @param hex user provided hex string
 * @returns an object with the hue, saturation and lightness values
 */
const hexToHsluv = (
  hex: hexString,
): {
  h: number
  s: number
  l: number
} => {
  // convert hex to hsluv
  const color = new Hsluv()
  color.hex = hex
  color.hexToHsluv()
  // extract h, s and l values
  const {hsluv_h: h, hsluv_s: s, hsluv_l: l} = color
  // return h, s, l as an object
  return {h, s, l}
}
/**
 * Takes an object with hue, saturation and lightness values and returns a hex string
 * @param hex user provided hex string
 * @returns an object with the hue, saturation and lightness values
 */
const hsluvToHex = ({h, s, l}: {h: number; s: number; l: number}): hexString => {
  // create a new HSLuv color object and assign values
  const color = new Hsluv()
  // eslint-disable-next-line camelcase
  color.hsluv_h = h
  // eslint-disable-next-line camelcase
  color.hsluv_s = s
  // eslint-disable-next-line camelcase
  color.hsluv_l = l
  // convert hsluv to hex
  color.hsluvToHex()
  // return hex string
  return color.hex as hexString
}
