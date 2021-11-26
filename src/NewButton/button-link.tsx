import React, {forwardRef} from 'react'
import {LinkButtonProps} from './types'
import ButtonBase from './button-base'

const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(
  ({children, as: Component = 'a', ...props}, forwardedRef): JSX.Element => {
    return (
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore can't figure out why it wont accept as
      <ButtonBase ref={forwardedRef} {...props} as={Component}>
        {children}
      </ButtonBase>
    )
  }
)

export default LinkButton
