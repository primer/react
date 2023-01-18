import theme from '../../theme-preval'

// TODO: Update the hard-coded values when the primitives are ready
export const PrimerViewports = {
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

export function breakpointHigher(width: string) {
  return `@media screen and (min-width: ${width})`
}

export function breakpointLower(width: string) {
  return `@media screen and (max-width: calc(${width} - 0.02px))`
}

export const mediaQueriesForViewportRanges = {
  narrow: breakpointLower(PrimerViewports.medium.width), // @media screen and (max-width: 768px - 0.02px) // < 768px (max-with is inclusive)
  regular: breakpointHigher(PrimerViewports.medium.width), // @media screen and (min-width: 768) // >= 768px
  wide: breakpointHigher(PrimerViewports.xxlarge.width), // (min-width: 1400px) // >= 1400px
}
