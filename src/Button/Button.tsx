import React, {forwardRef} from 'react'
import {ButtonProps} from './types'
import {ButtonBase} from './ButtonBase'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'

const ButtonComponent = forwardRef(({children, ...props}, forwardedRef): JSX.Element => {
  return (
    <ButtonBase ref={forwardedRef} as="button" {...props}>
      {children}
    </ButtonBase>
  )
}) as PolymorphicForwardRefComponent<'button', ButtonProps>

ButtonComponent.displayName = 'Button'

export {ButtonComponent}
