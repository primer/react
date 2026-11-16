import {cva, type VariantProps} from 'class-variance-authority'
import type React from 'react'
import {cn} from '../../internal/cn'

const labelVariants = cva(
  'primer:inline-flex primer:items-center primer:rounded-full primer:border-thin primer:font-medium primer:leading-none primer:whitespace-nowrap',
  {
    variants: {
      variant: {
        default: 'primer:border-default primer:bg-transparent primer:text-default',
        primary: 'primer:border-[var(--fgColor-default)] primer:bg-transparent primer:text-default',
        secondary: 'primer:border-muted primer:bg-transparent primer:text-muted',
        accent: 'primer:border-[var(--bgColor-accent-emphasis)] primer:bg-transparent primer:text-accent',
        success: 'primer:border-[var(--bgColor-success-emphasis)] primer:bg-transparent primer:text-success',
        attention: 'primer:border-[var(--bgColor-attention-emphasis)] primer:bg-transparent primer:text-attention',
        severe: 'primer:border-[var(--bgColor-severe-emphasis)] primer:bg-transparent primer:text-severe',
        danger: 'primer:border-danger-emphasis primer:bg-transparent primer:text-danger',
        done: 'primer:border-[var(--bgColor-done-emphasis)] primer:bg-transparent primer:text-done',
        sponsors: 'primer:border-[var(--bgColor-sponsors-emphasis)] primer:bg-transparent primer:text-sponsors',
      },
      size: {
        small: 'primer:h-5 primer:px-1.5 primer:text-xs primer:leading-none',
        large: 'primer:h-6 primer:px-2 primer:text-xs primer:leading-none',
      },
    },
    defaultVariants: {variant: 'default', size: 'small'},
  },
)

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
  return (
    <Component
      data-variant={variant === undefined ? 'default' : variant}
      {...rest}
      data-component="Label"
      className={cn(labelVariants({size, variant}), className)}
    />
  )
}

Label.displayName = 'Label'
