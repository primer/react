import {getContrast} from 'color2k'
import {Hsluv} from 'hsluv'
import type {Hex} from './IssueLabel'

/**
 * transforms a hex color provided by the user into a color object with background and text colors
 * @param colorHex — the hex color provided by the user
 * @returns
 */
export const getColorsFromHex = (colorHex: Hex): React.CSSProperties | undefined => {
  // start values for light mode
  const lightBgLightness = 96
  const lightLightnessIncrement: 1 | -1 = -1
  const lightRatio = 4.5

  const darkBgLightness = 16
  const darkLightnessIncrement: 1 | -1 = 1
  const darkRatio = 5.5

  // get hue and saturation value from hex color
  // eslint-disable-next-line prefer-const
  let {h, s} = hexToHsluv(colorHex)

  // avoid intense bright colors
  // Hue range: 58 - 198
  // 58 marks the transition from yellow to yellow-green
  // 198 makes the tranisiton from cyan to blue
  // yellow, yellow-green, green, cyan, blue tend to be bright and intense
  // Setting the hue range of 58 and 198 helps avoid bright colors
  // saturation: represents the intensity of a color, measured as a percentage from 0 to 100. Capping at 70% to avoid intense bright colors
  if (h >= 58 && h <= 198 && s > 70) {
    s = 70
  }
  /**
   * creating a background color from the provided hex color
   */
  const {colorHex: darkBackgroundColor, lightness: darkCurrentBgLightness} = getColorWithContrast(
    hsluvToHex({h, s, l: darkBgLightness}) as Hex,
    '#0d1117', // dark mode background color
    1.2,
    darkLightnessIncrement,
  )

  /**
   * creating a background color from the provided hex color
   */
  const {colorHex: lightBackgroundColor, lightness: lightCurrentBgLightness} = getColorWithContrast(
    hsluvToHex({h, s, l: lightBgLightness}) as Hex,
    '#ffffff', // light mode background color
    1.2,
    lightLightnessIncrement,
  )

  // avoid intense bright colors
  if (h >= 58 && h <= 316 && s > 80) {
    s = 80
  }
  /**
   * creating a text color from with a contrast ratio of at least 4.5 to the generated background color
   */
  const {colorHex: darkTextColor} = getColorWithContrast(
    hsluvToHex({h, s, l: 50}) as Hex,
    darkBackgroundColor,
    darkRatio,
    darkLightnessIncrement as 1 | -1,
  )

  const {colorHex: lightTextColor} = getColorWithContrast(
    hsluvToHex({h, s, l: 50}) as Hex,
    lightBackgroundColor,
    lightRatio,
    lightLightnessIncrement as 1 | -1,
  )

  return {
    '--label-bgColor-light-rest': lightBackgroundColor,
    '--label-bgColor-light-hover': hsluvToHex({h, s, l: lightCurrentBgLightness + 4 * lightLightnessIncrement}),
    '--label-bgColor-light-active': hsluvToHex({h, s, l: lightCurrentBgLightness + 8 * lightLightnessIncrement}),
    '--label-fgColor-light': lightTextColor,
    '--label-fgColor-light-hover': lightTextColor,
    '--label-fgColor-light-active': lightTextColor,
    '--label-bgColor-dark-rest': darkBackgroundColor,
    '--label-bgColor-dark-hover': hsluvToHex({h, s, l: darkCurrentBgLightness + 4 * darkLightnessIncrement}),
    '--label-bgColor-dark-active': hsluvToHex({h, s, l: darkCurrentBgLightness + 8 * darkLightnessIncrement}),
    '--label-fgColor-dark': darkTextColor,
    '--label-fgColor-dark-hover': darkTextColor,
    '--label-fgColor-dark-active': darkTextColor,
  } as React.CSSProperties
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
  fgColor: Hex,
  bgColor: Hex,
  contrastRatio: number,
  increment: 1 | -1,
): {colorHex: Hex; lightness: number} => {
  const hsluv = hexToHsluv(fgColor)
  let color: string = fgColor

  // change lightness until contrast is reached
  while (getContrast(color, bgColor) < contrastRatio && hsluv.l > 0 && hsluv.l < 100) {
    hsluv.l += increment
    color = hsluvToHex(hsluv)
  }

  return {
    colorHex: color as Hex,
    lightness: hsluv.l,
  }
}

/**
 * Takes a hex value and returns the hue, saturation and lightness for HSLuv as an object
 * @param hex user provided hex string
 * @returns an object with the hue, saturation and lightness values
 */
const hexToHsluv = (
  hex: Hex,
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
const hsluvToHex = ({h, s, l}: {h: number; s: number; l: number}): string => {
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
  return color.hex
}
