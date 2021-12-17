import React, {forwardRef} from 'react'
import {ButtonProps} from './types'
import ButtonBase from './ButtonBase'

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({children, ...props}, forwardedRef): JSX.Element => {
  return (
    <ButtonBase ref={forwardedRef} {...props} as="button">
      {children}
    </ButtonBase>
  )
})

Button.displayName = 'Button'

export {Button}
