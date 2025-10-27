/* eslint-disable primer-react/spread-props-first */
import {clsx} from 'clsx'
import React, {type ForwardedRef} from 'react'
import {useRefObjectAsForwardedRef} from '../hooks'
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
  const innerRef = React.useRef<HTMLElement>(null)
  useRefObjectAsForwardedRef(ref, innerRef)

  return (
    <Component
      className={clsx(className, classes.Text)}
      data-size={size}
      data-weight={weight}
      {...rest}
      ref={innerRef}
    />
  )
}

Text.displayName = 'Text'

export default fixedForwardRef(Text)
