// Copied over from primer/react/utils/theme

// Temporarily disabling since this is originally a JavaScript that needed to be
// migrated to TypeScript for exports to work as correctly in Vite.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import isEmpty from 'lodash.isempty'
import isObject from 'lodash.isobject'

function fontStack(fonts) {
  return fonts.map(font => (font.includes(' ') ? `"${font}"` : font)).join(', ')
}

// The following functions are a temporary measure for splitting shadow values out from the colors object.
// Eventually, we will push these structural changes upstream to primer/primitives so this data manipulation
// will not be needed.

function isShadowValue(value) {
  return typeof value === 'string' && /(inset\s|)([0-9.]+(\w*)\s){1,4}(rgb[a]?\(.*\)|\w+)/.test(value)
}

function isColorValue(value) {
  if (isShadowValue(value)) return false
  if (value.startsWith('#')) return true // #hex
  if (value.startsWith('rgb')) return true // rgb, rgba
  if (value.startsWith('hsl')) return true // hsl, hsla
  if (value.startsWith('var')) return true // var(--color)
  return false
}

function filterObject(obj, predicate) {
  if (Array.isArray(obj)) {
    return obj.filter(predicate)
  }

  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (isObject(value)) {
      const result = filterObject(value, predicate)

      // Don't include empty objects or arrays
      if (!isEmpty(result)) {
        acc[key] = result
      }
    } else if (predicate(value)) {
      acc[key] = value
    }

    return acc
  }, {})
}

function partitionColors(colors) {
  return {
    colors: filterObject(colors, value => isColorValue(value)),
    shadows: filterObject(colors, value => isShadowValue(value)),
  }
}

function omitScale(obj) {
  // This is intentionally removing `scale` from the provided object
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {scale, ...rest} = obj
  return rest
}

const themeUtils = {
  fontStack,
  isShadowValue,
  isColorValue,
  filterObject,
  partitionColors,
  omitScale,
}

export {fontStack, isShadowValue, isColorValue, filterObject, partitionColors, omitScale}

export default themeUtils

// Produces a union of dot-delimited keypaths to the string values in a nested object:
export type KeyPaths<O> = {
  [K in keyof O]: K extends string ? (O[K] extends Record<string, unknown> ? `${K}.${KeyPaths<O[K]>}` : `${K}`) : never
}[keyof O]
