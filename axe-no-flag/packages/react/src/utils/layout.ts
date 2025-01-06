import theme from '../theme'

// TODO: Update the hard-coded values when the primitives are ready
export const PrimerBreakpoints = {
  xsmall: {
    width: '320px',
  },
  small: {
    width: theme.breakpoints[0],
  },
  medium: {
    width: theme.breakpoints[1],
  },
  large: {
    width: theme.breakpoints[2],
  },
  xlarge: {
    width: theme.breakpoints[3],
  },
  xxlarge: {
    width: '1400px',
  },
}

export function breakpointHigher(width: string): string {
  return `@media screen and (min-width: ${width})`
}

export function breakpointLower(width: string): string {
  return `@media screen and (max-width: calc(${width} - 0.02px))`
}

// Media queries associated with Primer viewport ranges.
export const mediaQueries = {
  narrow: breakpointLower(PrimerBreakpoints.medium.width), // @media screen and (max-width: 768px - 0.02px) // < 768px (max-with is inclusive)
  regular: breakpointHigher(PrimerBreakpoints.medium.width), // @media screen and (min-width: 768) // >= 768px
  wide: breakpointHigher(PrimerBreakpoints.xxlarge.width), // (min-width: 1400px) // >= 1400px
}
