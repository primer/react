import React from 'react'
import {useOverflow} from '../hooks/useOverflow'
import classes from './ScrollableRegion.module.css'

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
    <div {...rest} {...regionProps} ref={ref} className={classes.ScrollableRegion}>
      {children}
    </div>
  )
}

export {ScrollableRegion}
export type {ScrollableRegionProps}
