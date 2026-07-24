import {cva, type VariantProps} from 'class-variance-authority'
import React from 'react'
import {cn} from '../../internal/cn'
import {VisuallyHidden} from '../VisuallyHidden'

const counterVariants = cva(
  'inline-flex min-w-5 items-center justify-center rounded-full px-1 text-xs font-medium tabular-nums',
  {
    variants: {
      variant: {primary: 'bg-accent-emphasis text-on-emphasis', secondary: 'bg-neutral-muted text-default'},
    },
    defaultVariants: {variant: 'secondary'},
  },
)

export interface CounterLabelProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof counterVariants> {
  'aria-label'?: string
}

export const CounterLabel = React.forwardRef<HTMLSpanElement, CounterLabelProps>(function CounterLabel(
  {children, className, variant, 'aria-label': ariaLabel, ...rest},
  ref,
) {
  const accessibleLabel = ariaLabel ?? `(${children})`
  return (
    <>
      <span
        {...rest}
        ref={ref}
        aria-hidden="true"
        data-component="CounterLabel"
        className={cn(counterVariants({variant}), className)}
      >
        {children}
      </span>
      <VisuallyHidden>{accessibleLabel}</VisuallyHidden>
    </>
  )
})

CounterLabel.displayName = 'CounterLabel'
