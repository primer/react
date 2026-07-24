import {cva, type VariantProps} from 'class-variance-authority'
import React from 'react'
import {cn} from '../../internal/cn'

const textVariants = cva('', {
  variants: {
    size: {small: 'text-xs', medium: 'text-sm', large: 'text-md'},
    weight: {light: 'font-light', normal: 'font-normal', medium: 'font-medium', semibold: 'font-semibold'},
    whiteSpace: {
      normal: 'whitespace-normal',
      nowrap: 'whitespace-nowrap',
      pre: 'whitespace-pre',
      preWrap: 'whitespace-pre-wrap',
      preLine: 'whitespace-pre-line',
    },
  },
  defaultVariants: {size: 'medium', weight: 'normal', whiteSpace: 'normal'},
})

export interface TextProps extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof textVariants> {
  as?: React.ElementType
}

export const Text = React.forwardRef<HTMLElement, TextProps>(function Text(
  {as: Component = 'span', className, size, weight, whiteSpace, ...rest},
  ref,
) {
  return (
    <Component
      {...rest}
      ref={ref}
      data-component="Text"
      className={cn(textVariants({size, weight, whiteSpace}), className)}
    />
  )
})

Text.displayName = 'Text'
