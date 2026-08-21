import {clsx} from 'clsx'
import type React from 'react'
import {type ForwardedRef} from 'react'
import classes from './Text.module.css'
import {fixedForwardRef, type PolymorphicProps} from '../utils/modern-polymorphic'
import {mergeProps} from '../utils/mergeProps'

export type TextProps<As extends React.ElementType = 'span'> = PolymorphicProps<
  As,
  'span',
  {
    size?: 'large' | 'medium' | 'small'
    weight?: 'light' | 'normal' | 'medium' | 'semibold'
    whiteSpace?: 'pre' | 'normal' | 'nowrap' | 'pre-wrap' | 'pre-line'
    className?: string
  }
>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Text<As extends React.ElementType>(props: TextProps<As>, ref: ForwardedRef<any>) {
  const {as: Component = 'span', className, size, weight, whiteSpace, ...rest} = props

  return (
    <Component
      ref={ref}
      {...mergeProps(
        {
          className: clsx(classes.Text, className),
          'data-component': 'Text',
          'data-size': size,
          'data-weight': weight,
          'data-white-space': whiteSpace,
        },
        rest,
      )}
    />
  )
}

Text.displayName = 'Text'

export default fixedForwardRef(Text)
