import type {ResponsiveValue} from '../hooks/useResponsiveValue'
import {isResponsiveValue} from '../hooks/useResponsiveValue'
import type {BetterSystemStyleObject} from '../sx'
import type {Properties as CSSProperties} from 'csstype'
import {mediaQueries} from './layout'

function areAllValuesTheSame(responsiveValue: ResponsiveValue<boolean | number | string>): boolean {
  if ('narrow' in responsiveValue && 'regular' in responsiveValue && 'wide' in responsiveValue) {
    const values = Object.values(responsiveValue)
    return values.every(value => value === values[0])
  }
  return false
}
function haveRegularAndWideSameValue(responsiveValue: ResponsiveValue<boolean | number | string>): boolean {
  if ('regular' in responsiveValue && 'wide' in responsiveValue) {
    return responsiveValue.regular === responsiveValue.wide
  }
  return false
}

/**
 * This function is inspired by the `useResponsiveValue` hook and it's used to render responsive values with CSS.
 * @param value - The value that needs to be rendered responsively
 * @param cssProperty - The CSS property whoes value needs to be rendered responsively
 * @param mapFn - A function that maps the given value to a CSS value
 *
 * If the value is responsive, it will only return the given viewports' breakpoints as CSS rules 
 * with the given CSS property and their mapped value. For viewports that are not specified, 
 * we need to provide a fallback CSS declaration in the component's sx prop along with the styles
 * that will return from this function.
 * 
 * @example
 * getBreakpointDeclarations({narrow: true, regular: true, wide: false}, 'display', value => {
      return value ? 'none' : 'flex'
    })
 * @returns
 * {
 *   "@media screen and (max-width: 768px)": {
 *     "display": "none"
 *   },
 *   "@media screen and (min-width: 768px)": {
 *     "display": "none"
 *   },
 *   "@media screen and (min-width: 1440px)": {
 *     "display": "flex"
 *   }
 * }
 * 
 * * @example
 * getBreakpointDeclarations({regular: 'border.default', wide: 'canvas.inset'}, 'backgroundColor', (value): string => {
    return value
  })
 * @returns
 * {
 *   "@media screen and (min-width: 768px)": {
 *     "backgroundColor": "border.default"
 *   },
 *   "@media screen and (min-width: 1440px)": {
 *     "backgroundColor": "canvas.inset"
 *   }
 * }
 * 
 * * @example
* getBreakpointDeclarations({narrow: 'filled', regular: 'line'}, 'height', (value): string => {
    return {
      filled: 8,
      line: 1,
    }[value]
  })
 * @returns
 * {
 *  "@media screen and (max-width: 768px)": {
 *     "height": 8
 *   }
 *   "@media screen and (min-width: 768px)": {
 *     "height": 1
 *   },
 * }
 * 
 * If multiple CSS properties need to be rendered responsively in the same CSS rule, this function 
 * can be called multiple times but make sure to deep merge the CSS declaration objects returned from this function. 
 * 
 * * @example
 * const mediaQueryStyles = merge<BetterSystemStyleObject>(
    getBreakpointDeclarations(hidden, 'display', value => {
      return value ? 'none' : 'flex'
    }),
    getBreakpointDeclarations(
      {
        narrow: 'none',
        regular: 'line',
        wide: 'filled',
      },
      'backgroundColor',
      (value): string => {
        return {
          none: 'pink',
          line: 'salmon',
          filled: 'blue',
        }[value]
      },
    ),
  )
 */
export function getBreakpointDeclarations<TInput, TOutput>(
  value: TInput | ResponsiveValue<TInput>,
  cssProperty: keyof CSSProperties,
  mapFn: (value: TInput) => TOutput,
): BetterSystemStyleObject {
  if (isResponsiveValue(value)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responsiveValue = value as Extract<TInput, ResponsiveValue<any>>

    // Build media queries with the giving cssProperty and mapFn
    const narrowMediaQuery =
      'narrow' in responsiveValue
        ? {
            [mediaQueries.narrow]: {
              [cssProperty]: mapFn(responsiveValue.narrow),
            },
          }
        : {}

    const regularMediaQuery =
      'regular' in responsiveValue
        ? {
            [mediaQueries.regular]: {
              [cssProperty]: mapFn(responsiveValue.regular),
            },
          }
        : {}

    const wideMediaQuery =
      'wide' in responsiveValue
        ? {
            [mediaQueries.wide]: {
              [cssProperty]: mapFn(responsiveValue.wide),
            },
          }
        : {}

    // check if all values are the same - this is not a recommended practise but we still should check for it
    if (areAllValuesTheSame(responsiveValue)) {
      // if all the values are the same, we can just use one of the value to determine the CSS property's value
      return {[cssProperty]: mapFn(responsiveValue.narrow)}
      // check if regular and wide have the same value, if so we can just return the narrow and regular media queries
    } else if (haveRegularAndWideSameValue(responsiveValue)) {
      return {
        ...narrowMediaQuery,
        ...regularMediaQuery,
      }
    } else {
      return {
        ...narrowMediaQuery,
        ...regularMediaQuery,
        ...wideMediaQuery,
      }
    }
  } else {
    // If the given value is not a responsive value
    return {[cssProperty]: mapFn(value)}
  }
}
