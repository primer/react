import {cva, type VariantProps} from 'class-variance-authority'
import React from 'react'
import {cn} from '../../internal/cn'

const labelVariants = cva('inline-flex items-center rounded-full font-medium whitespace-nowrap', {
  variants: {
    variant: {
      default: 'bg-muted text-default',
      primary: 'bg-accent-muted text-accent',
      secondary: 'bg-neutral-muted text-default',
      accent: 'bg-accent-muted text-accent',
      success: 'bg-success-muted text-success',
      attention: 'bg-attention-muted text-attention',
      severe: 'bg-severe-muted text-severe',
      danger: 'bg-danger-muted text-danger',
      done: 'bg-done-muted text-done',
      sponsors: 'bg-sponsors-muted text-sponsors',
    },
    size: {small: 'min-h-5 px-2 text-xs', large: 'min-h-6 px-2 text-sm'},
  },
  defaultVariants: {variant: 'default', size: 'small'},
})

export interface LabelProps extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof labelVariants> {
  as?: React.ElementType
}

export const Label = React.forwardRef<HTMLElement, LabelProps>(function Label(
  {as: Component = 'span', className, size, variant, ...rest},
  ref,
) {
  return (
    <Component {...rest} ref={ref} data-component="Label" className={cn(labelVariants({size, variant}), className)} />
  )
})

Label.displayName = 'Label'
