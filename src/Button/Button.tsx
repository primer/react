import React, {forwardRef} from 'react'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '@radix-ui/react-polymorphic'
import {ButtonProps} from './types'
import {ButtonBase} from './ButtonBase'

const ButtonComponent = forwardRef(
  ({children, as: As = 'button', ...props}, forwardedRef): JSX.Element => {
    return (
      <ButtonBase ref={forwardedRef} as={As} {...props}>
        {children}
      </ButtonBase>
    )
  }
) as PolymorphicForwardRefComponent<'button' | 'a', ButtonProps>

ButtonComponent.displayName = 'Button'

export {ButtonComponent}
