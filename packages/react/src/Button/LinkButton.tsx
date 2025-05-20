import {forwardRef} from 'react'
import type {LinkButtonProps, ButtonProps} from './types'
import {ButtonBase} from './ButtonBase'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {defaultSxProp} from '../utils/defaultSxProp'

type MyProps = LinkButtonProps & ButtonProps

const LinkButton = forwardRef(
  ({children, as: Component = 'a', sx = defaultSxProp, ...props}, forwardedRef): JSX.Element => {
    return (
      <ButtonBase as={Component} ref={forwardedRef} sx={sx} {...props}>
        {children}
      </ButtonBase>
    )
  },
) as PolymorphicForwardRefComponent<'a', MyProps>

export {LinkButton}
