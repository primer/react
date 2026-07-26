'use client'

import React from 'react'
import {cn} from '../../internal/cn'
import {assignRef} from '../../internal/refs'
import {useOverflow} from './useOverflow'

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
  const hasOverflow = useOverflow(element)
  const ref = React.useCallback(
    (node: HTMLElement | null) => {
      setElement(node)
      assignRef(forwardedRef, node)
    },
    [forwardedRef],
  )
  const regionProps = hasOverflow
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
      className={cn('relative overflow-auto', className)}
      data-component="ScrollableRegion"
    >
      {children}
    </div>
  )
})
