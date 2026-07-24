import {cva} from 'class-variance-authority'
import React from 'react'
import {cn} from '../../internal/cn'

const flash = cva('relative rounded-md border p-4 text-default [&_p:last-child]:mb-0 [&_svg]:mr-2', {
  variants: {
    variant: {
      default: 'border-accent-muted bg-accent-muted [&_svg]:text-accent',
      success: 'border-success-muted bg-success-muted [&_svg]:text-success',
      danger: 'border-danger-muted bg-danger-muted [&_svg]:text-danger',
      warning: 'border-attention-muted bg-attention-muted [&_svg]:text-attention',
    },
    full: {true: '-mt-px rounded-none border-x-0', false: ''},
  },
  defaultVariants: {variant: 'default', full: false},
})

export interface FlashProps extends React.ComponentPropsWithoutRef<'div'> {
  as?: React.ElementType
  variant?: 'default' | 'warning' | 'success' | 'danger'
  full?: boolean
}

export const Flash = React.forwardRef<HTMLElement, FlashProps>(function Flash(
  {as: Component = 'div', className, full = false, variant = 'default', ...rest},
  ref,
) {
  return (
    <Component
      {...rest}
      ref={ref}
      className={cn(flash({variant, full}), className)}
      data-component="Flash"
      data-full={full ? '' : undefined}
      data-variant={variant}
    />
  )
})
