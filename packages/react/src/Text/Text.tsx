import {clsx} from 'clsx'
import type React from 'react'
import {type ForwardedRef} from 'react'
import classes from './Text.module.css'
import {fixedForwardRef, type PolymorphicProps} from '../utils/modern-polymorphic'

export type TextProps<As extends React.ElementType = 'span'> = PolymorphicProps<
  As,
  'span',
  {
    size?: 'large' | 'medium' | 'small'
    weight?: 'light' | 'normal' | 'medium' | 'semibold'
    className?: string
  }
>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Text<As extends React.ElementType>(props: TextProps<As>, ref: ForwardedRef<any>) {
  const {as: Component = 'span', className, size, weight, ...rest} = props

  return (
    <Component className={clsx(className, classes.Text)} data-size={size} data-weight={weight} {...rest} ref={ref} />
  )
}

Text.displayName = 'Text'

export default fixedForwardRef(Text)
