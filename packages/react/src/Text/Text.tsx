import {clsx} from 'clsx'
import React, {forwardRef} from 'react'
import type {SystemCommonProps, SystemTypographyProps} from '../constants'
import {useRefObjectAsForwardedRef} from '../hooks'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import classes from './Text.module.css'

type StyledTextProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  as?: React.ComponentType<any> | keyof JSX.IntrinsicElements
  size?: 'large' | 'medium' | 'small'
  weight?: 'light' | 'normal' | 'medium' | 'semibold'
} & SystemTypographyProps &
  SystemCommonProps &
  React.HTMLAttributes<HTMLSpanElement>

const Text = forwardRef<HTMLElement, StyledTextProps>(
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
) as PolymorphicForwardRefComponent<'span', StyledTextProps>

Text.displayName = 'Text'

export type TextProps = StyledTextProps
export default Text
