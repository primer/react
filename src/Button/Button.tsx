import React, {forwardRef} from 'react'
import {ButtonProps} from './types'
import {ButtonBase} from './ButtonBase'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'

const ButtonComponent = forwardRef(({children, ...props}, forwardedRef): JSX.Element => {
  const {sx = {}} = props
  const cssSelector = `&[data-component="Button"]`
  const buttonStyles = {
    [cssSelector]: sx,
  }

  return (
    <ButtonBase data-component="Button" ref={forwardedRef} as="button" sx={buttonStyles} {...props}>
      {children}
    </ButtonBase>
  )
}) as PolymorphicForwardRefComponent<'button', ButtonProps>

ButtonComponent.displayName = 'Button'

export {ButtonComponent}
