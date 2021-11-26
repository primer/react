import React, {forwardRef} from 'react'
import {LinkButtonProps} from './types'
import ButtonBase from './button-base'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '@radix-ui/react-polymorphic'

const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(
  ({children, sx = {}, as: Component = 'a', ...props}, forwardedRef): JSX.Element => {
    return (
      // @ts-ignore can't figure out why it wont accept as
      <ButtonBase ref={forwardedRef} {...props} as={Component}>
        {children}
      </ButtonBase>
    )
  }
)

export default LinkButton
