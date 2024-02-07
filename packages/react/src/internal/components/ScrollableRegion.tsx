import React from 'react'
import Box from '../../Box'
import {useOverflow} from '../hooks/useOverflow'

type ScrollableRegionProps = React.PropsWithChildren<{
  'aria-labelledby'?: string
  className?: string
}>

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
    <Box {...rest} {...regionProps} ref={ref} sx={{overflow: 'auto'}}>
      {children}
    </Box>
  )
}
