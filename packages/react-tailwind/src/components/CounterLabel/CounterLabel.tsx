import {cva, type VariantProps} from 'class-variance-authority'
import React from 'react'
import {cn} from '../../internal/cn'
import {VisuallyHidden} from '../VisuallyHidden'

const counterVariants = cva(
  'primer:inline-block primer:rounded-[20px] primer:border-thin primer:border-transparent primer:px-1.5 primer:py-0.5 primer:text-xs primer:font-semibold primer:leading-none primer:empty:hidden',
  {
    variants: {
      variant: {
        primary: 'primer:bg-neutral-emphasis primer:text-on-emphasis',
        secondary: 'primer:bg-neutral-muted primer:text-default',
      },
    },
    defaultVariants: {variant: 'secondary'},
  },
)

export interface CounterLabelProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof counterVariants> {
  /** Accessible name giving the count meaning, since the number alone rarely explains itself. */
  'aria-label'?: string
  /** Overrides the marker used to identify this element in tests and styling. */
  'data-component'?: string
}

export const CounterLabel = React.forwardRef<HTMLSpanElement, CounterLabelProps>(function CounterLabel(
  {children, className, variant, 'aria-label': ariaLabel, 'data-component': dataComponent = 'CounterLabel', ...rest},
  ref,
) {
  const accessibleLabel = ariaLabel ?? `\u00a0(${children})`
  return (
    <>
      <span
        {...rest}
        ref={ref}
        aria-hidden="true"
        data-component={dataComponent}
        className={cn(counterVariants({variant}), className)}
      >
        {children}
      </span>
      <VisuallyHidden>{accessibleLabel}</VisuallyHidden>
    </>
  )
})

CounterLabel.displayName = 'CounterLabel'
