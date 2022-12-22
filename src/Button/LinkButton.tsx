import React, {forwardRef} from 'react'
import {merge, SxProp} from '../sx'
import {LinkButtonProps} from './types'
import {ButtonBase, ButtonBaseProps} from './ButtonBase'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'

type MyProps = LinkButtonProps & ButtonBaseProps

const LinkButton = forwardRef<HTMLElement, MyProps>(
  ({children, as: Component = 'a', sx = {}, ...props}, forwardedRef): JSX.Element => {
    const sxStyle = merge.all([sx as SxProp])
    return (
      <ButtonBase as={Component} ref={forwardedRef} sx={sxStyle} {...props}>
        {children}
      </ButtonBase>
    )
  },
) as PolymorphicForwardRefComponent<'a', ButtonBaseProps>

export {LinkButton}
