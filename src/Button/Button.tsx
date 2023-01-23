import React, {forwardRef} from 'react'
import {ButtonProps} from './types'
import {ButtonBase} from './ButtonBase'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {defaultSxProp} from '../utils/defaultSxProp'

const ButtonComponent = forwardRef(({children, sx: SxProp = defaultSxProp, ...props}, forwardedRef): JSX.Element => {
  // Possible data attributes: data-size, data-block, data-no-visuals
  const size = props.size ? `[data-size="${props.size}"]` : ''
  const block = props.block ? `[data-block="block"]` : ''
  const noVisuals = props.leadingIcon || props.trailingIcon || props.trailingAction ? '' : '[data-no-visuals="true"]'

  const cssSelector = `&${size}${block}${noVisuals}`
  // We need to make sure we add the sx styles to the css selector that has the highest specificity.
  const buttonStyles = {
    [cssSelector]: SxProp,
  }

  return (
    <ButtonBase ref={forwardedRef} as="button" sx={buttonStyles} {...props}>
      {children}
    </ButtonBase>
  )
}) as PolymorphicForwardRefComponent<'button', ButtonProps>

ButtonComponent.displayName = 'Button'

export {ButtonComponent}
