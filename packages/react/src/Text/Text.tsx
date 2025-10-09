import {clsx} from 'clsx'
import React, {forwardRef, useRef, type PropsWithChildren} from 'react'
import {useRefObjectAsForwardedRef} from '../hooks'
import classes from './Text.module.css'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'

export type TextProps = PropsWithChildren<{
  size?: 'large' | 'medium' | 'small'
  weight?: 'light' | 'normal' | 'medium' | 'semibold'
  className?: string
  as?: React.ElementType
}> &
  React.HTMLAttributes<HTMLElement>

const Text = forwardRef<HTMLElement, {as?: React.ElementType} & TextProps & React.HTMLAttributes<HTMLElement>>(
  ({as: Component = 'span', className, size, weight, ...props}, forwardedRef) => {
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
  },
) as PolymorphicForwardRefComponent<'span', TextProps>

Text.displayName = 'Text'

export default Text
