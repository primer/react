import {isResponsiveValue, ResponsiveValue} from '../hooks/useResponsiveValue'
import {BetterSystemStyleObject} from '../sx'

export function displayResponsively<T, F, A, B, C>(
  // what is your value that you want to render responsivley? - responsiveValue
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

    // arguments
    // what is the value that we want to render responsively? - responsiveValue
    // what is your css property? - display
    // truety value - none
    // falsy value - flex

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
