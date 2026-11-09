import {cva} from 'class-variance-authority'
import type React from 'react'
import {cn} from '../../internal/cn'
import type {TextSize} from '../../utils/types'
import type {PolymorphicProps} from '../../utils/types/component'

const textVariants = cva('', {
  variants: {
    size: {small: 'primer:text-xs', medium: 'primer:text-sm', large: 'primer:text-md'},
    weight: {
      light: 'primer:font-light',
      normal: 'primer:font-normal',
      medium: 'primer:font-medium',
      semibold: 'primer:font-semibold',
    },
    whiteSpace: {
      normal: 'primer:whitespace-normal',
      nowrap: 'primer:whitespace-nowrap',
      pre: 'primer:whitespace-pre',
      'pre-wrap': 'primer:whitespace-pre-wrap',
      'pre-line': 'primer:whitespace-pre-line',
    },
  },
})

export type TextProps<As extends React.ElementType = 'span'> = PolymorphicProps<
  As,
  {
    /**
     * Element to render. Its props, events, and ref follow the selected element.
     * @default 'span'
     */
    as?: As
    /** Size from the Primer type scale. */
    size?: TextSize
    /** Font weight. */
    weight?: 'light' | 'normal' | 'medium' | 'semibold'
    /** How whitespace and line breaks in the content are treated. */
    whiteSpace?: 'normal' | 'nowrap' | 'pre' | 'pre-wrap' | 'pre-line'
  },
  'span'
>

export function Text<As extends React.ElementType = 'span'>({
  as,
  className,
  size,
  weight,
  whiteSpace,
  ...rest
}: TextProps<As>) {
  const Component = as ?? 'span'
  return (
    <Component {...rest} data-component="Text" className={cn(textVariants({size, weight, whiteSpace}), className)} />
  )
}

Text.displayName = 'Text'
