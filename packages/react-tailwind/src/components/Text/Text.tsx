import {cva} from 'class-variance-authority'
import React from 'react'
import {cn} from '../../internal/cn'
import type {AsProp, TextSize} from '../../utils/types'

const textVariants = cva('', {
  variants: {
    size: {small: 'text-xs', medium: 'text-sm', large: 'text-md'},
    weight: {light: 'font-light', normal: 'font-normal', medium: 'font-medium', semibold: 'font-semibold'},
    whiteSpace: {
      normal: 'whitespace-normal',
      nowrap: 'whitespace-nowrap',
      pre: 'whitespace-pre',
      'pre-wrap': 'whitespace-pre-wrap',
      'pre-line': 'whitespace-pre-line',
    },
  },
})

export interface TextProps extends React.HTMLAttributes<HTMLElement>, AsProp {
  /** Size from the Primer type scale. */
  size?: TextSize
  /** Font weight. */
  weight?: 'light' | 'normal' | 'medium' | 'semibold'
  /** How whitespace and line breaks in the content are treated. */
  whiteSpace?: 'normal' | 'nowrap' | 'pre' | 'pre-wrap' | 'pre-line'
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
