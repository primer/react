import {getContrast} from 'color2k'
import {Hsluv} from 'hsluv'

export const getColorsFromHex = (colorHex: string, colorScheme = 'light', isSelected = false, bgColor: string) => {
  let bgLightness = 96
  let lightnessIncrement = -1
  let ratio = 4.5
  if (colorScheme.startsWith('dark')) {
    bgLightness = 16
    lightnessIncrement = 1
    ratio = 5.5
  }

  // eslint-disable-next-line prefer-const
  let {h, s} = hexToHsluv(colorHex)
  // avoid intense bright colors
  if (h >= 58 && h <= 198 && s > 70) {
    s = 70
  }

  const backgroundColor = getColorWithContrast(
    hsluvToHex({h, s, l: bgLightness}),
    bgColor,
    1.2,
    lightnessIncrement as 1 | -1,
  )

  // avoid intense bright colors
  if (h >= 58 && h <= 316 && s > 80) {
    s = 80
  }
  const textColor = getColorWithContrast(
    hsluvToHex({h, s, l: 50}),
    backgroundColor,
    ratio,
    lightnessIncrement as 1 | -1,
  )
  // return
  return {
    backgroundColor,
    textColor,
    borderColor: isSelected
      ? getColorWithContrast(backgroundColor, backgroundColor, 3, lightnessIncrement as 1 | -1)
      : 'transparent',
    '&:hover': {
      backgroundColor: hsluvToHex({h, s, l: bgLightness + 2 * lightnessIncrement}),
      boxShadow: 'var(--shadow-resting-medium)',
    },
  }
}

const getColorWithContrast = (colorHex: string, bgHex: string, contrastRatio: number, increment: 1 | -1): string => {
  // deconstruct color
  let {l: lightness} = hexToHsluv(colorHex)
  const {h, s} = hexToHsluv(colorHex)
  // get color
  while (getContrast(colorHex, bgHex) < contrastRatio && lightness > 0 && lightness < 100) {
    lightness += increment
    colorHex = hsluvToHex({h, s, l: lightness})
  }
  // return
  return colorHex
}

const hexToHsluv = (hex: string) => {
  const color = new Hsluv()
  color.hex = hex
  color.hexToHsluv()
  const {hsluv_h: h, hsluv_s: s, hsluv_l: l} = color
  return {h, s, l}
}

const hsluvToHex = ({h, s, l}: {h: number; s: number; l: number}): string => {
  const color = new Hsluv()
  // eslint-disable-next-line camelcase
  color.hsluv_h = h
  // eslint-disable-next-line camelcase
  color.hsluv_s = s
  // eslint-disable-next-line camelcase
  color.hsluv_l = l
  color.hsluvToHex()
  return color.hex
}
