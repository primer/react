import {useMedia} from './useMedia'

export type ResponsiveValue<TRegular, TNarrow = TRegular, TWide = TRegular> = {
  narrow?: TNarrow // Applies when viewport is < 768px
  regular?: TRegular // Applies when viewports is >= 768px
  wide?: TWide // Applies when viewports is >= 1400px
}

/**
 * Flattens all possible value types into single union type
 * For example, if `T` is `'none' | 'line' | Responsive<'none' | 'line' | 'filled'>`,
 * `FlattenResponsiveValue<T>` will be `'none' | 'line' | 'filled'`
 */
export type FlattenResponsiveValue<T> =
  | (T extends ResponsiveValue<infer TRegular, infer TNarrow, infer TWide> ? TRegular | TNarrow | TWide : never)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | Exclude<T, ResponsiveValue<any>>

/**
 * Checks if the value is a responsive value.
 * In other words, is it an object with viewport range keys?
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isResponsiveValue(value: any): value is ResponsiveValue<any> {
  return typeof value === 'object' && Object.keys(value).some(key => ['narrow', 'regular', 'wide'].includes(key))
}

/**
 * Resolves responsive values based on the current viewport width.
 * For example, if the current viewport width is narrow (less than 768px), the value of `{regular: 'foo', narrow: 'bar'}` will resolve to `'bar'`.
 */
export function useResponsiveValue<T, F>(value: T, fallback: F): FlattenResponsiveValue<T> | F {
  // Check viewport size
  // TODO: Get these breakpoint values from primer/primitives
  // TODO: What are the performance implications of creating media query listeners in this hook?
  const isNarrowViewport = useMedia('(max-width: 767px)') // < 768px
  const isRegularViewport = useMedia('(min-width: 768px)') // >= 768px
  const isWideViewport = useMedia('(min-width: 1400px)') // >= 1400px

  if (isResponsiveValue(value)) {
    // If we've reached this line, we know that value is a responsive value
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responsiveValue = value as Extract<T, ResponsiveValue<any>>

    if (isNarrowViewport && 'narrow' in responsiveValue) {
      return responsiveValue.narrow
    } else if (isWideViewport && 'wide' in responsiveValue) {
      return responsiveValue.wide
    } else if (isRegularViewport && 'regular' in responsiveValue) {
      return responsiveValue.regular
    } else {
      return fallback
    }
  } else {
    // If we've reached this line, we know that value is not a responsive value
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return value as Exclude<T, ResponsiveValue<any>>
  }
}
