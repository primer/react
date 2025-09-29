// TODO: merge https://github.com/primer/react/pull/6631 which removes `Box` usage

import {clsx} from 'clsx'
import Box from '../Box'
import classes from './Label.module.css'
import React from 'react'
import type {BetterSystemStyleObject, SxProp} from '../sx'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'

export type LabelProps = {
  /** The color of the label */
  variant?: LabelColorOptions
  /** How large the label is rendered */
  size?: LabelSizeKeys
} & SxProp

export type LabelColorOptions =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'success'
  | 'attention'
  | 'severe'
  | 'danger'
  | 'done'
  | 'sponsors'

type LabelSizeKeys = 'small' | 'large'

export const variants: Record<LabelColorOptions, BetterSystemStyleObject> = {
  default: {
    borderColor: 'border.default',
  },
  primary: {
    borderColor: 'fg.default',
  },
  secondary: {
    borderColor: 'border.muted',
    color: 'fg.muted',
  },
  accent: {
    borderColor: 'accent.emphasis',
    color: 'accent.fg',
  },
  success: {
    borderColor: 'success.emphasis',
    color: 'success.fg',
  },
  attention: {
    borderColor: 'attention.emphasis',
    color: 'attention.fg',
  },
  severe: {
    borderColor: 'severe.emphasis',
    color: 'severe.fg',
  },
  danger: {
    borderColor: 'danger.emphasis',
    color: 'danger.fg',
  },
  done: {
    borderColor: 'done.emphasis',
    color: 'done.fg',
  },
  sponsors: {
    borderColor: 'sponsors.emphasis',
    color: 'sponsors.fg',
  },
}

const Label = React.forwardRef(function Label({as, size = 'small', variant = 'default', className, ...rest}, ref) {
  const Component = as || 'span'
  if (rest.sx) {
    return (
      <Box
        as={Component}
        className={clsx(className, classes.Label)}
        data-size={size}
        data-variant={variant}
        ref={ref}
        {...rest}
      />
    )
  }
  return (
    <Component className={clsx(className, classes.Label)} data-size={size} data-variant={variant} ref={ref} {...rest} />
  )
}) as PolymorphicForwardRefComponent<'span', LabelProps>

export default Label
