import {clsx} from 'clsx'
import React from 'react'
import type {SxProp} from '../sx'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {BoxWithFallback} from '../internal/components/BoxWithFallback'
import classes from './Flash.module.css'

export type FlashProps = React.ComponentPropsWithoutRef<'div'> & {
  className?: string
  variant?: 'default' | 'warning' | 'success' | 'danger'
  full?: boolean
} & SxProp

const Flash = React.forwardRef(function Flash({as, className, variant = 'default', full, sx, ...rest}, ref) {
  return (
    <BoxWithFallback
      {...rest}
      ref={ref}
      as={as}
      className={clsx(classes.Flash, className)}
      data-full={full ? '' : undefined}
      data-variant={variant}
      sx={sx}
    />
  )
}) as PolymorphicForwardRefComponent<'div', FlashProps>

if (__DEV__) {
  Flash.displayName = 'Flash'
}

export default Flash
