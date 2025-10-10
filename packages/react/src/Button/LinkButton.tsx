import {forwardRef} from 'react'
import type {LinkButtonProps as BaseLinkButtonProps, ButtonProps} from './types'
import {ButtonBase} from './ButtonBase'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'

export type LinkButtonProps = Omit<BaseLinkButtonProps & ButtonProps, 'sx'>

const LinkButton = forwardRef(({children, as: Component = 'a', ...props}, forwardedRef): JSX.Element => {
  return (
    <ButtonBase as={Component} ref={forwardedRef} {...props}>
      {children}
    </ButtonBase>
  )
}) as PolymorphicForwardRefComponent<'a', LinkButtonProps>

// @ts-ignore -- TS doesn't know about the __SLOT__ property
LinkButton.__SLOT__ = Symbol('LinkButton')

export {LinkButton}
