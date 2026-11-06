import {cva, type VariantProps} from 'class-variance-authority'
import type React from 'react'
import {cn} from '../../internal/cn'

const labelVariants = cva('inline-flex items-center rounded-full border font-medium leading-none whitespace-nowrap', {
  variants: {
    variant: {
      default: 'border-default bg-transparent text-default',
      primary: 'border-[var(--fgColor-default)] bg-transparent text-default',
      secondary: 'border-muted bg-transparent text-muted',
      accent: 'border-[var(--bgColor-accent-emphasis)] bg-transparent text-accent',
      success: 'border-[var(--bgColor-success-emphasis)] bg-transparent text-success',
      attention: 'border-[var(--bgColor-attention-emphasis)] bg-transparent text-attention',
      severe: 'border-[var(--bgColor-severe-emphasis)] bg-transparent text-severe',
      danger: 'border-danger-emphasis bg-transparent text-danger',
      done: 'border-[var(--bgColor-done-emphasis)] bg-transparent text-done',
      sponsors: 'border-[var(--bgColor-sponsors-emphasis)] bg-transparent text-sponsors',
    },
    size: {small: 'h-5 px-1.5 text-xs leading-none', large: 'h-6 px-2 text-xs leading-none'},
  },
  defaultVariants: {variant: 'default', size: 'small'},
})

export type LabelProps<As extends React.ElementType = 'span'> = VariantProps<typeof labelVariants> & {
  /**
   * Element to render. Its props and ref follow the selected element.
   * @default 'span'
   */
  as?: As
  className?: string
} & Omit<React.ComponentPropsWithRef<As>, 'as' | 'className' | 'size' | 'variant'>

export function Label<As extends React.ElementType = 'span'>({as, className, size, variant, ...rest}: LabelProps<As>) {
  const Component = as ?? 'span'
  return <Component {...rest} data-component="Label" className={cn(labelVariants({size, variant}), className)} />
}

Label.displayName = 'Label'
