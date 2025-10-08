import {clsx} from 'clsx'
import React, {forwardRef} from 'react'
import {useRefObjectAsForwardedRef} from '../hooks'
import classes from './Text.module.css'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'

type StyledTextProps = {
  size?: 'large' | 'medium' | 'small'
  weight?: 'light' | 'normal' | 'medium' | 'semibold'
} & React.HTMLAttributes<HTMLElement>

const Text = forwardRef(({as: Component = 'span', className, size, weight, ...props}, forwardedRef) => {
  const innerRef = React.useRef<HTMLElement>(null)
  useRefObjectAsForwardedRef(forwardedRef, innerRef)

  return (
    <Component
      className={clsx(className, classes.Text)}
      data-size={size}
      data-weight={weight}
      {...props}
      ref={innerRef}
    />
  )
}) as PolymorphicForwardRefComponent<'span', StyledTextProps>

Text.displayName = 'Text'

export type TextProps = StyledTextProps
export default Text
