import {isResponsiveValue, ResponsiveValue} from '../hooks/useResponsiveValue'
import {BetterSystemStyleObject} from '../sx'

/**
 * This function is inspired by the `useResponsiveValue` hook and it's used to render responsive values with CSS.
 * @param value - The value that we want to render responsively
 * @param fallback - The fallback value
 * @param cssProperty - The CSS property that we want to render
 * @param truety - The value that we want to render when the value is true
 * @param falsy - The value that we want to render when the value is false
 
 * @example
 * CSSManagedResponsiveValue({narrow: true, regular: true, wide: false}, false, 'display', 'none', 'flex')
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
 */
export function CSSManagedResponsiveValue<T, F, B, C>(
  value: T,
  fallback: F,
  cssProperty: string,
  truety: B,
  falsy: C,
): BetterSystemStyleObject {
  if (isResponsiveValue(value)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responsiveValue = value as Extract<T, ResponsiveValue<any>>
    const checkFallback = fallback ? truety : falsy

    return {
      [`@media screen and (max-width: 768px)`]: {
        [cssProperty]: 'narrow' in responsiveValue ? (responsiveValue.narrow ? truety : falsy) : checkFallback,
      },
      [`@media screen and (min-width: 768px)`]: {
        [cssProperty]: 'regular' in responsiveValue ? (responsiveValue.regular ? truety : falsy) : checkFallback,
      },
      [`@media screen and (min-width: 1440px)`]: {
        [cssProperty]: 'wide' in responsiveValue ? (responsiveValue.wide ? truety : falsy) : checkFallback,
      },
    }
  } else {
    return {[cssProperty]: value ? truety : falsy}
  }
}
