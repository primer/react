import {clsx} from 'clsx'
import Box from '../Box'
import classes from './Label.module.css'
import React from 'react'
import type {SxProp} from '../sx'
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
  return <Component className={clsx(className, classes.Label)} data-size={size} data-variant={variant} {...rest} />
}) as PolymorphicForwardRefComponent<'span', LabelProps>

export default Label
