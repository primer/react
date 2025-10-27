// TODO: merge https://github.com/primer/react/pull/6631 which removes `Box` usage

/* eslint-disable primer-react/spread-props-first */
import {clsx} from 'clsx'
import classes from './Label.module.css'
import React from 'react'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'

export type LabelProps = {
  /** The color of the label */
  variant?: LabelColorOptions
  /** How large the label is rendered */
  size?: LabelSizeKeys
}

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

const Label = React.forwardRef(function Label(
  {as: Component = 'span', size = 'small', variant = 'default', className, ...rest},
  ref,
) {
  return (
    <Component className={clsx(className, classes.Label)} data-size={size} data-variant={variant} ref={ref} {...rest} />
  )
}) as PolymorphicForwardRefComponent<'span', LabelProps>

export default Label
