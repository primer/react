import {useMediaUnsafeSSR} from './useMediaUnsafeSSR'

// This file contains utilities for working with responsive values.

// The viewport range values from @primer/primtives don't work in Chrome
// because they use `em` units inside `calc()` (e.g., calc(48em - 0.02px)).
// As a temporary workaround, we're hardcoding the viewport ranges in `px` units.
// TODO: Use viewport range tokens from @primer/primitives
export const viewportRanges = {
  narrow: '(max-width: calc(768px - 0.02px))', // < 768px
  regular: '(min-width: 768px)', // >= 768px
  wide: '(min-width: 1400px)', // >= 1400px
}

export type ResponsiveValue<TRegular, TNarrow = TRegular, TWide = TRegular> = {
  narrow?: TNarrow // Applies when viewport is narrow
  regular?: TRegular // Applies when viewports is regular
  wide?: TWide // Applies when viewports is wide
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
 *
 * Warning: This hook is not fully SSR compatible as it relies on `useMediaUnsafeSSR` without a `defaultState`. Using `getResponsiveAttributes` is preferred to avoid hydration mismatches.
 *
 * @example
 * const value = useResponsiveValue({regular: 'foo', narrow: 'bar'})
 * console.log(value) // 'bar'
 */
export function useResponsiveValue<T, F>(value: T, fallback: F): FlattenResponsiveValue<T> | F {
  // TODO: Improve SSR support
  // TODO: What is the performance cost of creating media query listeners in this hook?
  // Check viewport size
  const isNarrowViewport = useMediaUnsafeSSR(viewportRanges.narrow, false)
  const isRegularViewport = useMediaUnsafeSSR(viewportRanges.regular, false)
  const isWideViewport = useMediaUnsafeSSR(viewportRanges.wide, false)

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
