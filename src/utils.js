import chroma from 'chroma-js'
import {css} from 'styled-components'
import {theme} from 'styled-system'

// color shortcuts
export const color = name => theme(`colors.${name}`)
export const black = color('black')
export const white = color('white')

/**
 * Reduce a value to a primitive as long as it is a function.
 *
 * interpolate(() => 'x') // returns 'x'
 * interpolate(() => () => 'y') // returns 'y'
 */
export const interpolate = (value, context, props) => {
  while (typeof value === 'function') {
    value = value.call(context, props)
  }
  return value
}

/**
 * This decorator interpolates all of the function's arguments by calling any
 * functions in the provided context and with the provided arguments. In other
 * words, the function you provide is guaranteed to have all of its arguments
 * "called" if they are functions. Example:
 *
 * const rgba = interpolator((rgb, a) => chroma(rgb).alpha(a).css())
 * const fadeed = rgba(theme('colors.black'), .5) // returns a function!
 * faded({}) // probably throws an error because props.theme isn't set
 */
export const interpolator = f => {
  return (...outer) => {
    return function(props) {
      return f(...[...outer].map(a => interpolate(a, this, props)))
    }
  }
}

export const rgba = interpolator(       (rgb, alpha)    => chroma(rgb).alpha(alpha).css())
export const lighten = interpolator(    (value, amount) => chroma(value).brighten(amount).css())
export const darken = interpolator(     (value, amount) => chroma(value).darken(amount).css())
export const desaturate = interpolator( (value, amount) => chroma(value).desaturate(amount).css())
export const mix = interpolator(        (a, b, amount)  => chroma.mix(a, b, amount).css())
