import {getContrast} from 'color2k'
import {Hsluv} from 'hsluv'
import type {Hex} from './IssueLabel'

/**
 * transforms a hex color provided by the user into a color object with background and text colors
 * @param colorHex — the hex color provided by the user
 * @param colorScheme — the color scheme the user has currently set
 * @param bgColor — the background color from the selected theme, needed to calc the contrast for the colors
 * @returns
 */
export const getColorsFromHex = (
  colorHex: Hex,
  colorScheme = 'light',
  bgColor: Hex,
): React.CSSProperties | undefined => {
  // start values for light mode
  let bgLightness = 96
  let lightnessIncrement: 1 | -1 = -1
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
  const {colorHex: backgroundColor, lightness: currentBgLightness} = getColorWithContrast(
    hsluvToHex({h, s, l: bgLightness}) as Hex,
    bgColor,
    1.2,
    lightnessIncrement,
  )

  // avoid intense bright colors
  if (h >= 58 && h <= 316 && s > 80) {
    s = 80
  }
  /**
   * creating a text color from with a contrast ratio of at least 4.5 to the generated background color
   */
  const {colorHex: textColor} = getColorWithContrast(
    hsluvToHex({h, s, l: 50}) as Hex,
    backgroundColor,
    ratio,
    lightnessIncrement as 1 | -1,
  )

  return {
    '--label-bgColor-rest': backgroundColor,
    '--label-bgColor-hover': hsluvToHex({h, s, l: currentBgLightness + 4 * lightnessIncrement}),
    '--label-bgColor-active': hsluvToHex({h, s, l: currentBgLightness + 8 * lightnessIncrement}),
    '--label-fgColor': textColor,
    '--label-fgColor-hover': textColor,
    '--label-fgColor-active': textColor,
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
