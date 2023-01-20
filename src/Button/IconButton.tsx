import React, {forwardRef} from 'react'
import {IconButtonProps} from './types'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {ButtonBase} from './ButtonBase'

const IconButton = forwardRef((props, forwardedRef): JSX.Element => {
  const {sx = {}, icon: Icon, ...rest} = props

  // check if we have the size prop, if we do we want to add data-size with its value to the css selector

  const size = props.size ? `[data-size="${props.size}"]` : ''

  // we need to make sure we add the sx styles to the css selector that has the highest specificity.
  // sx : Object { width: 16px, height: 16px}
  const cssSelector = `&[data-component="IconButton"]${size}`
  // what we want : '&[data-component="IconButton"][data-component="Overrides"] : sx & IconButon styles'

  const iconButtonStyles = {
    [cssSelector]: sx,
  }

  return (
    // @ts-expect-error StyledButton wants both Anchor and Button refs
    <ButtonBase data-component="IconButton" sx={iconButtonStyles} {...rest} ref={forwardedRef}>
      <Icon />
    </ButtonBase>
  )
}) as PolymorphicForwardRefComponent<'button' | 'a', IconButtonProps>

export {IconButton}
