import React, {forwardRef} from 'react'
import {ButtonProps} from './types'
import {ButtonBase} from './ButtonBase'

const ButtonComponent = forwardRef<HTMLButtonElement, ButtonProps>(
  ({children, ...props}, forwardedRef): JSX.Element => {
    return (
      <ButtonBase ref={forwardedRef} {...props} as="button">
        {children}
      </ButtonBase>
    )
  }
)

ButtonComponent.displayName = 'Button'

export {ButtonComponent}
