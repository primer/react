export type ChildSize = {
  text: string
  width: number
}
export type ChildWidthArray = Array<ChildSize>
export type ResponsiveProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: Array<React.ReactElement<any>>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  menuItems: Array<React.ReactElement<any>>
}

/**
 *
 * Each breakpoint key defines which item indices should be visible at that viewport size.
 * Items not in the visible array will be hidden in the inline list but shown in the overflow menu.
 *
 * Example:
 * ```
 * {
 *   narrow: [0, 1],           // Show first 2 items inline at narrow viewport
 *   regular: [0, 1, 2, 3],    // Show first 4 items inline at regular viewport
 *   wide: 'all'               // Show all items inline at wide viewport (hide menu)
 * }
 * ```
 */
export type ResponsiveOverflowConfig = {
  /** Items visible at extra-narrow viewport (max-width: 544px) */
  xnarrow?: number[] | 'all'
  /** Items visible at narrow viewport (544px - 768px) */
  narrow?: number[] | 'all'
  /** Items visible at regular viewport (768px - 1024px) */
  regular?: number[] | 'all'
  /** Items visible at medium viewport (1024px - 1280px) */
  medium?: number[] | 'all'
  /** Items visible at large viewport (1280px - 1400px) */
  large?: number[] | 'all'
  /** Items visible at wide viewport (min-width: 1400px) */
  wide?: number[] | 'all'
}
