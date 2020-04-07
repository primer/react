import {Platform} from '../primitives'

function rgbToHex(r, g, b) {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

// Shadow parsing functions adapted from https://github.com/jxnblk/css-box-shadow | MIT
const VALUES_REG = /,(?![^(]*\))/
const PARTS_REG = /\s(?![^(]*\))/
const LENGTH_REG = /^[0-9]+[a-zA-Z%]+?$/

const parseValue = (str) => {
  const parts = str.split(PARTS_REG)
  const inset = parts.includes('inset')
  const last = parts.slice(-1)[0]
  const color = !isLength(last) ? last : undefined

  const nums = parts
    .filter((n) => n !== 'inset')
    .filter((n) => n !== color)
    .map(toNum)
  const [offsetX, offsetY, blurRadius, spreadRadius] = nums

  return {
    inset,
    offsetX,
    offsetY,
    blurRadius,
    spreadRadius,
    color,
  }
}

// const stringifyValue = (obj) => {
//   const {inset, offsetX = 0, offsetY = 0, blurRadius = 0, spreadRadius, color} = obj || {}

//   return [inset ? 'inset' : null, offsetX, offsetY, blurRadius, spreadRadius, color]
//     .filter((v) => v !== null && v !== undefined)
//     .map(toPx)
//     .map((s) => `${s}`.trim())
//     .join(' ')
// }

const isLength = (v) => v === '0' || LENGTH_REG.test(v)
const toNum = (v) => {
  if (!/px$/.test(v) && v !== '0') return v
  const n = parseFloat(v)
  return !isNaN(n) ? n : v
}
// const toPx = (n) => (typeof n === 'number' && n !== 0 ? n + 'px' : n)

const parse = (str) =>
  str
    .split(VALUES_REG)
    .map((s) => s.trim())
    .map(parseValue)

// const stringify = (arr) => arr.map(stringifyValue).join(', ')

const parseRgba = (color) => {
  const [r, g, b, a = 1] = color
    .replace('rgba', '')
    .slice(1, -1)
    .split(',')
    .map((n) => Number(n.trim()))
  return {r, g, b, a}
}

const makeCss = ({shadowColor, shadowOffset, shadowOpacity, shadowRadius, shadowSpread}) => `
  shadow-color: ${shadowColor};
  shadow-offset: ${shadowOffset.width || 0}px ${shadowOffset.height || 0}px;
  shadow-opacity: ${shadowOpacity || 1};
  shadow-radius: ${shadowRadius || 0}px;
  ${shadowSpread ? `shadow-spread: ${shadowSpread};` : ''} 
`

export const makeShadow = (_shadow, elevation = 1) => {
  switch (Platform.OS) {
    case 'web': {
      return `box-shadow: ${_shadow};`
    }
    case 'ios':
    case 'sketch':
    case 'figma': {
      let shadows = typeof _shadow === 'function' ? _shadow({}) : _shadow
      shadows = typeof shadows === 'string' ? parse(shadows) : shadows

      // Assume native platforms don't support multiple shadows – Need a way to pass shadow arrays to Figma
      const shadow = Array.isArray(shadows) ? shadows[0] : shadows

      const {offsetX, offsetY, blurRadius, spreadRadius, color} = shadow

      const rgba = color.includes('rgba') ? parseRgba(color) : null
      const {r, g, b, a: opacity = 1} = rgba || {}

      return makeCss({
        shadowColor: rgba ? rgbToHex(r, g, b) : color,
        shadowOffset: {width: offsetX, height: offsetY},
        shadowOpacity: opacity,
        shadowRadius: blurRadius,
        shadowSpread: Platform.OS === 'sketch' ? spreadRadius : undefined, // *shadowSpread* not supported in RN
      })
    }
    case 'android': {
      return `elevation: ${elevation};`
    }
    default: {
      return ''
    }
  }
}
