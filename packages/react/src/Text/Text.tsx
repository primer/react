import {clsx} from 'clsx'
import {type StyledComponent} from 'styled-components'
import React, {forwardRef} from 'react'
import type {SystemCommonProps, SystemTypographyProps} from '../constants'
import {COMMON, TYPOGRAPHY} from '../constants'
import type {SxProp} from '../sx'
import Box from '../Box'
import {useRefObjectAsForwardedRef} from '../hooks'
import classes from './Text.module.css'

export type TextProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  as?: React.ComponentType<any> | keyof JSX.IntrinsicElements
  size?: 'large' | 'medium' | 'small'
  weight?: 'light' | 'normal' | 'medium' | 'semibold'
} & SystemTypographyProps &
  SystemCommonProps &
  SxProp

const COMMON_PROP_NAMES = new Set(Object.keys(COMMON))
const TYPOGRAPHY_PROP_NAMES = new Set(Object.keys(TYPOGRAPHY))

const includesSystemProps = (props: StyledTextProps) => {
  if (props.sx) {
    return true
  }

  return Object.keys(props).some(prop => {
    return TYPOGRAPHY_PROP_NAMES.has(prop) || COMMON_PROP_NAMES.has(prop)
  })
}

const Text = forwardRef(({as: Component = 'span', className, size, weight, ...props}, forwardedRef) => {
  const innerRef = React.useRef<HTMLElement>(null)
  useRefObjectAsForwardedRef(forwardedRef, innerRef)

  // If props includes TYPOGRAPHY or COMMON props, pass them to the Box component
  if (includesSystemProps(props)) {
    return (
      <Box
        as={Component}
        className={clsx(className, classes.Text)}
        data-size={size}
        data-weight={weight}
        {...props}
        ref={innerRef}
      />
    )
  }

  return (
    <Component
      className={clsx(className, classes.Text)}
      data-size={size}
      data-weight={weight}
      {...props}
      ref={innerRef}
    />
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}) as StyledComponent<'span', any, TextProps, never>

Text.displayName = 'Text'

export default Text
