import {clsx} from 'clsx'
import type {StyledComponent} from 'styled-components'
import React, {forwardRef} from 'react'
import type {SystemCommonProps, SystemTypographyProps} from '../constants'
import type {SxProp} from '../sx'
import {useRefObjectAsForwardedRef} from '../hooks'
import classes from './Text.module.css'
import {BoxWithFallback} from '../internal/components/BoxWithFallback'

type StyledTextProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  as?: React.ComponentType<any> | keyof JSX.IntrinsicElements
  size?: 'large' | 'medium' | 'small'
  weight?: 'light' | 'normal' | 'medium' | 'semibold'
} & SystemTypographyProps &
  SystemCommonProps &
  SxProp &
  React.HTMLAttributes<HTMLSpanElement>

const Text = forwardRef(({as: Component = 'span', className, size, weight, ...props}, forwardedRef) => {
  const innerRef = React.useRef<HTMLElement>(null)
  useRefObjectAsForwardedRef(forwardedRef, innerRef)

  return (
    <BoxWithFallback
      as={Component}
      className={clsx(className, classes.Text)}
      data-size={size}
      data-weight={weight}
      {...props}
      // @ts-ignore shh
      ref={innerRef}
    />
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}) as StyledComponent<'span', any, StyledTextProps, never>

Text.displayName = 'Text'

export type TextProps = StyledTextProps
export default Text
