import React, {forwardRef} from 'react'
import {defaultSxProp} from '../utils/defaultSxProp'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {ButtonBase, ButtonBaseProps} from './ButtonBase'
import {LinkButtonProps} from './types'

type MyProps = LinkButtonProps & ButtonBaseProps

const LinkButton = forwardRef(
  ({children, as: Component = 'a', sx = defaultSxProp, ...props}, forwardedRef): JSX.Element => {
    return (
      <ButtonBase
        as={Component}
        // @ts-expect-error ButtonBase wants both Anchor and Button refs
        ref={forwardedRef}
        sx={sx}
        {...props}
      >
        {children}
      </ButtonBase>
    )
  },
) as PolymorphicForwardRefComponent<'a', MyProps>

export {LinkButton}
