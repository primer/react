import React from 'react'
import Box from '../../Box'
import {useOverflow} from '../hooks/useOverflow'
import {SxProp} from '../../sx'

type ScrollableRegionProps = React.PropsWithChildren<{
  'aria-labelledby'?: string
  className?: string
}> &
  SxProp

export function ScrollableRegion({'aria-labelledby': labelledby, children, sx, ...rest}: ScrollableRegionProps) {
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
    <Box {...rest} {...regionProps} ref={ref} sx={{overflow: 'auto', ...sx}}>
      {children}
    </Box>
  )
}
