import React from 'react'
import Box from '../Box'
import {useOverflow} from '../hooks/useOverflow'

type Labelled =
  | {
      'aria-label': string
      'aria-labelledby'?: never
    }
  | {
      'aria-label'?: never
      'aria-labelledby': string
    }

type ScrollableRegionProps = React.ComponentPropsWithoutRef<'div'> & Labelled

const defaultStyles = {
  // When setting overflow, we also set `position: relative` to avoid
  // `position: absolute` items breaking out of the container and causing
  // scrollbars on the page. This can occur with common classes like `sr-only`
  // and can cause difficult to track down layout issues
  position: 'relative',
  overflow: 'auto',
}

function ScrollableRegion({
  'aria-label': label,
  'aria-labelledby': labelledby,
  children,
  ...rest
}: ScrollableRegionProps) {
  const ref = React.useRef(null)
  const hasOverflow = useOverflow(ref)
  const regionProps = hasOverflow
    ? {
        'aria-label': label,
        'aria-labelledby': labelledby,
        role: 'region',
        tabIndex: 0,
      }
    : {}

  return (
    <Box {...rest} {...regionProps} ref={ref} sx={defaultStyles}>
      {children}
    </Box>
  )
}

export {ScrollableRegion}
export type {ScrollableRegionProps}
