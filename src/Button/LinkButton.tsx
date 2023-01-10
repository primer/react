import React, {forwardRef} from 'react'
import {BetterSystemStyleObject, merge} from '../sx'
import {LinkButtonProps} from './types'
import {ButtonBase, ButtonBaseProps} from './ButtonBase'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {defaultSxProp} from '../utils/defaultSxProp'

type MyProps = LinkButtonProps & ButtonBaseProps

const LinkButton = forwardRef(
  ({children, as: Component = 'a', sx = defaultSxProp, ...props}, forwardedRef): JSX.Element => {
    const style = {
      width: 'fit-content',
      '&:hover:not([disabled])': {
        textDecoration: 'underline',
      },
      // focus must come before :active so that the active box shadow overrides
      '&:focus:not([disabled])': {
        textDecoration: 'underline',
      },
      '&:active:not([disabled])': {
        textDecoration: 'underline',
      },
    }
    const sxStyle = merge.all<BetterSystemStyleObject>([style, sx])
    return (
      <ButtonBase
        as={Component}
        // @ts-expect-error ButtonBase wants both Anchor and Button refs
        ref={forwardedRef}
        sx={sxStyle}
        {...props}
      >
        {children}
      </ButtonBase>
    )
  },
) as PolymorphicForwardRefComponent<'a', MyProps>

export {LinkButton}
