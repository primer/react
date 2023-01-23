import React, {forwardRef} from 'react'
import {IconButtonProps} from './types'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {ButtonBase} from './ButtonBase'
import {defaultSxProp} from '../utils/defaultSxProp'

const IconButton = forwardRef(({sx: sxProp = defaultSxProp, icon: Icon, ...props}, forwardedRef): JSX.Element => {
  // check if we have the size prop, if we do we want to add data-size with its value to the css selector
  const size = props.size ? `[data-size="${props.size}"]` : ''

  // we need to make sure we add the sx styles to the css selector that has the highest specificity.
  const cssSelector = `&[data-component="IconButton"]${size}`

  const iconButtonStyles = {
    [cssSelector]: sxProp,
  }

  return (
    // @ts-expect-error StyledButton wants both Anchor and Button refs
    <ButtonBase icon={Icon} data-component="IconButton" sx={iconButtonStyles} {...props} ref={forwardedRef} />
  )
}) as PolymorphicForwardRefComponent<'button' | 'a', IconButtonProps>

export {IconButton}
