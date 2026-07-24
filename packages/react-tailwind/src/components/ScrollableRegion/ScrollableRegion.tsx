'use client'

import React from 'react'
import {cn} from '../../internal/cn'
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

function assignRef<T>(ref: React.ForwardedRef<T>, value: T | null): void {
  if (typeof ref === 'function') {
    ref(value)
  } else if (ref !== null) {
    ;(ref as React.MutableRefObject<T | null>).current = value
  }
}

export const ScrollableRegion = React.forwardRef<HTMLDivElement, ScrollableRegionProps>(function ScrollableRegion(
  {'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy, className, ...rest},
  forwardedRef,
) {
  const [element, setElement] = React.useState<HTMLDivElement | null>(null)
  const hasOverflow = useOverflow(element)
  const ref = React.useCallback(
    (node: HTMLDivElement | null) => {
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
    />
  )
})
