import {cva, type VariantProps} from 'class-variance-authority'
import React from 'react'
import {cn} from '../../internal/cn'
import {VisuallyHidden} from '../VisuallyHidden'

const counterVariants = cva(
  'inline-block rounded-[20px] border border-transparent px-1.5 py-0.5 text-xs font-semibold leading-none tabular-nums empty:hidden',
  {
    variants: {
      variant: {primary: 'bg-neutral-emphasis text-on-emphasis', secondary: 'bg-neutral-muted text-default'},
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
