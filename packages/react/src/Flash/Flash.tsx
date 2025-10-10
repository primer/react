import {clsx} from 'clsx'
import React from 'react'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import classes from './Flash.module.css'

export type FlashProps = React.ComponentPropsWithoutRef<'div'> & {
  className?: string
  variant?: 'default' | 'warning' | 'success' | 'danger'
  full?: boolean
}

const Flash = React.forwardRef(function Flash(
  {as: BaseComponent = 'div', className, variant = 'default', full, ...rest},
  ref,
) {
  return (
    <BaseComponent
      {...rest}
      ref={ref}
      className={clsx(classes.Flash, className)}
      data-full={full ? '' : undefined}
      data-variant={variant}
    />
  )
}) as PolymorphicForwardRefComponent<'div', FlashProps>

if (__DEV__) {
  Flash.displayName = 'Flash'
}

// @ts-ignore -- TS doesn't know about the __SLOT__ property
Flash.__SLOT__ = Symbol('Flash')

export default Flash
