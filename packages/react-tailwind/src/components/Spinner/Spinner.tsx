'use client'

import {cva, type VariantProps} from 'class-variance-authority'
import React from 'react'
import {cn} from '../../internal/cn'
import {VisuallyHidden} from '../VisuallyHidden'

const spinnerVariants = cva('inline-block animate-spin motion-reduce:animate-none', {
  variants: {size: {small: 'size-4', medium: 'size-8', large: 'size-16'}},
  defaultVariants: {size: 'medium'},
})

const spinnerSize = {
  small: 16,
  medium: 32,
  large: 64,
} as const

const animationDurationMs = 1000

export interface SpinnerProps extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof spinnerVariants> {
  srText?: string | null
  delay?: boolean | 'short' | 'long' | number
}

export const Spinner = React.forwardRef<HTMLElement, SpinnerProps>(function Spinner(
  {className, delay = false, size, srText = 'Loading', ...rest},
  ref,
) {
  const resolvedSize = size ?? 'medium'
  const [{syncDelay, visible}, setVisibleState] = React.useState(() => ({
    syncDelay: 0,
    visible: !delay,
  }))

  React.useEffect(() => {
    if (!delay) {
      setVisibleState({syncDelay: computeSyncDelay(), visible: true})
      return
    }

    const delayDuration = typeof delay === 'number' ? delay : delay === 'short' ? 300 : 1000
    const timeout = window.setTimeout(() => {
      setVisibleState({syncDelay: computeSyncDelay(), visible: true})
    }, delayDuration)

    return () => window.clearTimeout(timeout)
  }, [delay])

  if (!visible) return null
  return (
    <span
      {...rest}
      ref={ref}
      role={srText === null ? undefined : 'status'}
      data-component="Spinner"
      className={cn('inline-flex leading-none', className)}
    >
      <svg
        viewBox="0 0 16 16"
        fill="none"
        width={spinnerSize[resolvedSize]}
        height={spinnerSize[resolvedSize]}
        aria-hidden="true"
        className={spinnerVariants({size: resolvedSize})}
        style={{animationDelay: `${syncDelay}ms`}}
      >
        <circle
          cx="8"
          cy="8"
          r="7"
          stroke="currentColor"
          strokeOpacity=".25"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M15 8a7.002 7.002 0 00-7-7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {srText !== null && !rest['aria-label'] && <VisuallyHidden>{srText}</VisuallyHidden>}
    </span>
  )
})

Spinner.displayName = 'Spinner'

function computeSyncDelay() {
  const now = typeof performance === 'undefined' ? 0 : performance.now()
  return -(now % animationDurationMs)
}
