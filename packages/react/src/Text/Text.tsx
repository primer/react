import {clsx} from 'clsx'
import React, {forwardRef} from 'react'
import {useRefObjectAsForwardedRef} from '../hooks'
import classes from './Text.module.css'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'

type StyledTextProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  as?: React.ComponentType<any> | keyof JSX.IntrinsicElements
  size?: 'large' | 'medium' | 'small'
  weight?: 'light' | 'normal' | 'medium' | 'semibold'
} & React.HTMLAttributes<HTMLSpanElement>

const Text = forwardRef(({as: Component = 'span', className, size, weight, ...props}, forwardedRef) => {
  const innerRef = React.useRef<HTMLElement>(null)
  useRefObjectAsForwardedRef(forwardedRef, innerRef)

  return (
    <Component
      className={clsx(className, classes.Text)}
      data-size={size}
      data-weight={weight}
      {...props}
      // @ts-ignore shh
      ref={innerRef}
    />
  )
}) as PolymorphicForwardRefComponent<'span', StyledTextProps>

Text.displayName = 'Text'

export type TextProps = StyledTextProps
export default Text
