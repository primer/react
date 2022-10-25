import React, {forwardRef} from 'react'
import {ButtonProps} from './types'
import {ButtonBase} from './ButtonBase'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'

const ButtonComponent: PolymorphicForwardRefComponent<'button', ButtonProps> = forwardRef<
  HTMLButtonElement,
  ButtonProps
>(({children, ...props}, forwardedRef): JSX.Element => {
  return (
    <ButtonBase ref={forwardedRef} as="button" {...props}>
      {children}
    </ButtonBase>
  )
})

ButtonComponent.displayName = 'Button'

export {ButtonComponent}
