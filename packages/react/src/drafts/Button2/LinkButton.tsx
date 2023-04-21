import React, {forwardRef} from 'react'
import {LinkButtonProps} from './types'
import {ButtonBase, ButtonBaseProps} from './ButtonBase'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '../../utils/polymorphic'
import {defaultSxProp} from '../../utils/defaultSxProp'

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
