import {forwardRef, type JSX} from 'react'
import type {LinkButtonProps as BaseLinkButtonProps, ButtonProps} from './types'
import {ButtonBase} from './ButtonBase'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {mergeProps} from '../utils/mergeProps'

export type LinkButtonProps = BaseLinkButtonProps & ButtonProps

const LinkButton = forwardRef(({children, as: Component = 'a', ...props}, forwardedRef): JSX.Element => {
  return (
    <ButtonBase {...mergeProps({as: Component, 'data-component': 'LinkButton'}, props)} ref={forwardedRef}>
      {children}
    </ButtonBase>
  )
}) as PolymorphicForwardRefComponent<'a', LinkButtonProps>

export {LinkButton}
