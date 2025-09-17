import {forwardRef} from 'react'
import type {LinkButtonProps, ButtonProps} from './types'
import {ButtonBase} from './ButtonBase'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'

type MyProps = Omit<LinkButtonProps & ButtonProps, 'sx'>

const LinkButton = forwardRef(({children, as: Component = 'a', ...props}, forwardedRef): JSX.Element => {
  return (
    <ButtonBase as={Component} ref={forwardedRef} {...props}>
      {children}
    </ButtonBase>
  )
}) as PolymorphicForwardRefComponent<'a', MyProps>

export {LinkButton}
