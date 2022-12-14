import {isResponsiveValue, ResponsiveValue} from '../hooks/useResponsiveValue'
import {BetterSystemStyleObject} from '../sx'

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
 * @param comparisonFunc - A function that evaluates which value to assign to the CSS property
 
 * @example
 * CSSManagedResponsiveValue({narrow: true, regular: true, wide: false}, 'display', value => {
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
 * CSSManagedResponsiveValue({regular: 'border.default', wide: 'canvas.inset'}, 'backgroundColor', (value): string => {
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
* CSSManagedResponsiveValue({narrow: 'filled', regular: 'line'}, 'height', (value): string => {
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
 */
export function CSSManagedResponsiveValue<T>(
  value: T,
  cssProperty: string,
  comparisonFunc: (value: T) => void,
): BetterSystemStyleObject {
  if (isResponsiveValue(value)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responsiveValue = value as Extract<T, ResponsiveValue<any>>

    // Build media queries with the giving cssProperty and comparisonFunc
    const narrowMediaQuery =
      'narrow' in responsiveValue
        ? {
            [`@media screen and (max-width: 768px)`]: {
              [cssProperty]: comparisonFunc(responsiveValue.narrow),
            },
          }
        : {}

    const regularMediaQuery =
      'regular' in responsiveValue
        ? {
            [`@media screen and (min-width: 768px)`]: {
              [cssProperty]: comparisonFunc(responsiveValue.regular),
            },
          }
        : {}

    const wideMediaQuery =
      'wide' in responsiveValue
        ? {
            [`@media screen and (min-width: 1440px)`]: {
              [cssProperty]: comparisonFunc(responsiveValue.wide),
            },
          }
        : {}

    // check if all values are the same - this is not a recommended practise but we still should check for it
    if (areAllValuesTheSame(responsiveValue)) {
      // if all the values are the same, we can just use one of the value to determine the CSS property's value
      return {[cssProperty]: comparisonFunc(responsiveValue.narrow)}
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
    return {[cssProperty]: comparisonFunc(value)}
  }
}
