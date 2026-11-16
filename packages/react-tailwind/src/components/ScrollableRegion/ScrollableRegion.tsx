'use client'

import React from 'react'
import {cn} from '../../internal/cn'
import {mergeRefs} from '../../internal/refs'
import {useOverflowWithFocusRetention} from './useOverflow'

type Labelled =
  | {
      'aria-label': string
      'aria-labelledby'?: never
    }
  | {
      'aria-label'?: never
      'aria-labelledby': string
    }

export type ScrollableRegionProps = Omit<React.ComponentPropsWithoutRef<'div'>, 'aria-label' | 'aria-labelledby'> &
  Labelled

export const ScrollableRegion = React.forwardRef<HTMLElement, ScrollableRegionProps>(function ScrollableRegion(
  {'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy, children, className, ...rest},
  forwardedRef,
) {
  const [element, setElement] = React.useState<HTMLElement | null>(null)
  const needsRegion = useOverflowWithFocusRetention(element)
  const ref = React.useMemo(() => mergeRefs(setElement, forwardedRef), [forwardedRef])
  const regionProps = needsRegion
    ? {
        'aria-label': ariaLabel,
        'aria-labelledby': ariaLabelledBy,
        role: 'region',
        tabIndex: 0,
      }
    : {}

  return (
    <div
      {...rest}
      {...regionProps}
      ref={ref}
      className={cn('primer:relative primer:overflow-auto', className)}
      data-component="ScrollableRegion"
    >
      {children}
    </div>
  )
})
