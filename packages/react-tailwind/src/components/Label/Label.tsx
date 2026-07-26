import {cva, type VariantProps} from 'class-variance-authority'
import React from 'react'
import {cn} from '../../internal/cn'

const labelVariants = cva('inline-flex items-center rounded-full border font-medium leading-none whitespace-nowrap', {
  variants: {
    variant: {
      default: 'border-default bg-transparent text-default',
      primary: 'border-default bg-transparent text-default',
      secondary: 'border-muted bg-transparent text-muted',
      accent: 'border-accent-emphasis bg-transparent text-accent',
      success: 'border-success-emphasis bg-transparent text-success',
      attention: 'border-attention-emphasis bg-transparent text-attention',
      severe: 'border-severe-emphasis bg-transparent text-severe',
      danger: 'border-danger-emphasis bg-transparent text-danger',
      done: 'border-done-emphasis bg-transparent text-done',
      sponsors: 'border-sponsors-emphasis bg-transparent text-sponsors',
    },
    size: {small: 'h-5 px-1.5 text-xs leading-none', large: 'h-[26px] px-2 text-sm leading-none'},
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
