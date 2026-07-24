'use client'

import {cva, type VariantProps} from 'class-variance-authority'
import React from 'react'
import {cn} from '../../internal/cn'
import {VisuallyHidden} from '../VisuallyHidden'

const spinnerVariants = cva('inline-block animate-spin motion-reduce:animate-none', {
  variants: {size: {small: 'size-4', medium: 'size-8', large: 'size-16'}},
  defaultVariants: {size: 'medium'},
})

export interface SpinnerProps extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof spinnerVariants> {
  srText?: string | null
  delay?: boolean | 'short' | 'long' | number
}

export const Spinner = React.forwardRef<HTMLElement, SpinnerProps>(function Spinner(
  {className, delay = false, size, srText = 'Loading', ...rest},
  ref,
) {
  const [visible, setVisible] = React.useState(!delay)
  React.useEffect(() => {
    if (!delay) return
    const timeout = window.setTimeout(
      () => setVisible(true),
      typeof delay === 'number' ? delay : delay === 'short' ? 300 : 1000,
    )
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
      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={spinnerVariants({size})}>
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
          d="M15 8a7 7 0 0 0-7-7"
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
