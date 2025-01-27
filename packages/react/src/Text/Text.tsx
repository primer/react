import {clsx} from 'clsx'
import React from 'react'
import type {SystemCommonProps, SystemTypographyProps} from '../constants'
import type {SxProp} from '../sx'
import Box from '../Box'
import {useRefObjectAsForwardedRef} from '../hooks'
import {includesSystemProps} from '../utils/includeSystemProps'
import classes from './Text.module.css'

export type TextProps<As extends React.ElementType> = {
  as?: As
  size?: 'large' | 'medium' | 'small'
  weight?: 'light' | 'normal' | 'medium' | 'semibold'
} & DistributiveOmit<React.ComponentPropsWithRef<React.ElementType extends As ? 'span' : As>, 'as'> &
  SystemTypographyProps &
  SystemCommonProps &
  SxProp

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Text<As extends React.ElementType>(props: TextProps<As>, forwardedRef: React.ForwardedRef<any>) {
  const {as: Component = 'span', className, size, weight, ...rest} = props
  const innerRef = React.useRef<HTMLElement>(null)
  useRefObjectAsForwardedRef(forwardedRef, innerRef)

  // If props includes TYPOGRAPHY or COMMON props, pass them to the Box component
  if (includesSystemProps(rest)) {
    return (
      <Box
        as={Component}
        className={clsx(className, classes.Text)}
        data-size={size}
        data-weight={weight}
        {...rest}
        ref={innerRef}
      />
    )
  }

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

// eslint-disable-next-line @typescript-eslint/ban-types
type FixedForwardRef = <T, P = {}>(
  render: (props: P, ref: React.Ref<T>) => React.ReactNode,
) => (props: P & React.RefAttributes<T>) => React.ReactNode

const fixedForwardRef = React.forwardRef as FixedForwardRef

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DistributiveOmit<T, TOmitted extends PropertyKey> = T extends any ? Omit<T, TOmitted> : never

Text.displayName = 'Text'

export default fixedForwardRef(Text)
