import React from 'react'
import Box from '../../Box'
import {useOverflow} from '../hooks/useOverflow'

type ScrollableRegionProps = React.PropsWithChildren<{
  'aria-labelledby'?: string
  className?: string
}>

const defaultStyles = {
  // When setting overflow, we also set `position: relative` to avoid
  // `position: absolute` items breaking out of the container and causing
  // scrollabrs on the page. This can occur with common classes like `sr-only`
  // and can cause difficult to track down layout issues
  position: 'relative',
  overflow: 'auto',
}

export function ScrollableRegion({'aria-labelledby': labelledby, children, ...rest}: ScrollableRegionProps) {
  const ref = React.useRef(null)
  const hasOverflow = useOverflow(ref)
  const regionProps = hasOverflow
    ? {
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
