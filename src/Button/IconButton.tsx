import React, {forwardRef} from 'react'
import {defaultSxProp} from '../utils/defaultSxProp'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {generateCustomSxProp} from './Button'
import {ButtonBase} from './ButtonBase'
import {IconButtonProps} from './types'

const IconButton = forwardRef(({sx: sxProp = defaultSxProp, icon: Icon, ...props}, forwardedRef): JSX.Element => {
  let sxStyles = sxProp
  // grap the button props that have associated data attributes in the styles
  const {size} = props

  if (sxProp !== null && Object.keys(sxProp).length > 0) {
    sxStyles = generateCustomSxProp({size}, sxProp)
  }

  return (
    // @ts-expect-error StyledButton wants both Anchor and Button refs
    <ButtonBase icon={Icon} data-component="IconButton" sx={sxStyles} {...props} ref={forwardedRef} />
  )
}) as PolymorphicForwardRefComponent<'button' | 'a', IconButtonProps>

export {IconButton}
