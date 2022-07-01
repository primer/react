import React, {forwardRef} from 'react'
import {ButtonProps} from './types'
import {ButtonBase} from './ButtonBase'

const ButtonComponent = forwardRef<HTMLButtonElement, ButtonProps>(
  ({children, ...props}, forwardedRef): JSX.Element => {
    return (
      <ButtonBase ref={forwardedRef} as="button" {...props}>
        {children}
      </ButtonBase>
    )
  }
)

ButtonComponent.displayName = 'Button'

export {ButtonComponent}
