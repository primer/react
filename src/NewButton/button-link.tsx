import React, {forwardRef} from 'react'
import {LinkButtonProps} from './types'
import ButtonBase, {ButtonBaseProps} from './button-base'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '@radix-ui/react-polymorphic'

type MyProps = LinkButtonProps & ButtonBaseProps

const LinkButton = forwardRef<HTMLElement, MyProps>(
  ({children, as: Component = 'a', ...props}, forwardedRef): JSX.Element => {
    return (
      <ButtonBase as={Component} ref={forwardedRef} {...props}>
        {children}
      </ButtonBase>
    )
  }
) as PolymorphicForwardRefComponent<'a', ButtonBaseProps>

export default LinkButton
