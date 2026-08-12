import React from 'react'
import {clsx} from 'clsx'
import {useOverflow} from '../hooks/useOverflow'
import classes from './ScrollableRegion.module.css'
import {mergeProps} from '../utils/mergeProps'

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
  className,
  ...rest
}: ScrollableRegionProps) {
  const ref = React.useRef(null)
  const hasOverflow = useOverflow(ref)
  return (
    <div
      ref={ref}
      {...mergeProps({className: clsx(classes.ScrollableRegion, className)}, rest)}
      aria-label={hasOverflow ? label : undefined}
      aria-labelledby={hasOverflow ? labelledby : undefined}
      role={hasOverflow ? 'region' : rest.role}
      tabIndex={hasOverflow ? 0 : rest.tabIndex}
      data-component="ScrollableRegion"
    >
      {children}
    </div>
  )
}

export {ScrollableRegion}
export type {ScrollableRegionProps}
