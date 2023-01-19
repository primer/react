import React, {forwardRef} from 'react'
import {IconButtonProps} from './types'
import {ButtonBase} from './ButtonBase'

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>((props, forwardedRef): JSX.Element => {
  const {sx = {}, ...rest} = props

  // check if we have the size prop, if we do we want to add data-size with its value to the css selector
  const size = props.size ? `[data-size="${props.size}"]` : ''
  // we need to make sure we add the sx styles to the css selector that has the highest specificity.
  const cssSelector = `&[data-component="IconButton"]${size}`

  const iconButtonStyles = {
    [cssSelector]: sx,
  }
  return <ButtonBase data-component="IconButton" sx={iconButtonStyles} {...rest} ref={forwardedRef} />
})

export {IconButton}
