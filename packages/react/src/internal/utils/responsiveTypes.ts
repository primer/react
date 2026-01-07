/**
 * Types and utilities for working with responsive values in an SSR-safe manner.
 *
 * These utilities support the CSS-based responsive pattern documented in ADR-018,
 * which uses data attributes and CSS media queries instead of JavaScript-driven
 * viewport detection. This approach prevents hydration mismatches and layout shift
 * during server-side rendering.
 *
 * @see contributor-docs/adrs/adr-018-responsive-values.md
 */

/**
 * A responsive value that can vary based on viewport size.
 * Used with CSS data attributes to apply different values at different breakpoints.
 *
 * @example
 * ```tsx
 * // Component usage
 * <PageLayout.Pane position={{narrow: 'start', regular: 'end'}} />
 *
 * // Generates data attributes: data-position-narrow="start" data-position-regular="end"
 * // CSS handles the responsive behavior via media queries
 * ```
 */
export type ResponsiveValue<TRegular, TNarrow = TRegular, TWide = TRegular> = {
  narrow?: TNarrow // Applies when viewport is narrow (< 768px)
  regular?: TRegular // Applies when viewport is regular (>= 768px)
  wide?: TWide // Applies when viewport is wide (>= 1400px)
}

/**
 * Flattens all possible value types into a single union type.
 * Useful for extracting all possible values from a responsive prop type.
 *
 * @example
 * ```tsx
 * type DividerProp = 'none' | 'line' | ResponsiveValue<'none' | 'line' | 'filled'>
 * type AllDividerValues = FlattenResponsiveValue<DividerProp>
 * // Result: 'none' | 'line' | 'filled'
 * ```
 */
export type FlattenResponsiveValue<T> =
  | (T extends ResponsiveValue<infer TRegular, infer TNarrow, infer TWide> ? TRegular | TNarrow | TWide : never)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | Exclude<T, ResponsiveValue<any>>

/**
 * Checks if a value is a responsive value object.
 * This is a type guard that checks if the value is an object containing
 * viewport range keys (narrow, regular, or wide).
 *
 * This function is SSR-safe because it only checks the object structure,
 * not the current viewport size.
 *
 * @param value - The value to check
 * @returns True if the value is a ResponsiveValue object
 *
 * @example
 * ```tsx
 * if (isResponsiveValue(position)) {
 *   // position is { narrow?: string, regular?: string, wide?: string }
 * } else {
 *   // position is string
 * }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isResponsiveValue(value: any): value is ResponsiveValue<any> {
  return typeof value === 'object' && Object.keys(value).some(key => ['narrow', 'regular', 'wide'].includes(key))
}
