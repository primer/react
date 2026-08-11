import {forwardRef, type JSX} from 'react'
import type {ButtonProps} from './types'
import {ButtonBase} from './ButtonBase'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {mergeProps} from '../utils/mergeProps'

const ButtonComponent = forwardRef(({children, ...props}, forwardedRef): JSX.Element => {
  return (
    <ButtonBase {...mergeProps({as: 'button', type: 'button'}, props)} ref={forwardedRef}>
      {children}
    </ButtonBase>
  )
}) as PolymorphicForwardRefComponent<'button', ButtonProps>

ButtonComponent.displayName = 'Button'

export {ButtonComponent, type ButtonProps}

ButtonComponent.__SLOT__ = Symbol('Button')
