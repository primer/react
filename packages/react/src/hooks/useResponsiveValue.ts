import {useMedia} from './useMedia'
// Import for local use in the hook implementation
import type {ResponsiveValue, FlattenResponsiveValue} from '../internal/utils/responsiveTypes'
import {isResponsiveValue} from '../internal/utils/responsiveTypes'
// Re-export types and utilities from the SSR-safe module
// These are kept here for backward compatibility
export type {ResponsiveValue, FlattenResponsiveValue} from '../internal/utils/responsiveTypes'
export {isResponsiveValue} from '../internal/utils/responsiveTypes'

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

/**
 * Resolves responsive values based on the current viewport width.
 * For example, if the current viewport width is narrow (less than 768px), the value of `{regular: 'foo', narrow: 'bar'}` will resolve to `'bar'`.
 *
 * @example
 * const value = useResponsiveValue({regular: 'foo', narrow: 'bar'})
 * console.log(value) // 'bar'
 */
// TODO: Improve SSR support
export function useResponsiveValue<T, F>(value: T, fallback: F): FlattenResponsiveValue<T> | F {
  // Check viewport size
  // TODO: What is the performance cost of creating media query listeners in this hook?
  const isNarrowViewport = useMedia(viewportRanges.narrow, false)
  const isRegularViewport = useMedia(viewportRanges.regular, false)
  const isWideViewport = useMedia(viewportRanges.wide, false)

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
