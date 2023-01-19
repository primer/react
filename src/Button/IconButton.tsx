import React, {forwardRef} from 'react'
import {merge, SxProp} from '../sx'
import {IconButtonProps} from './types'
import {ButtonBase} from './ButtonBase'

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>((props, forwardedRef): JSX.Element => {
  const {sx = {}, icon: Icon, ...rest} = props

  // const sxStyle = merge.all([sx as SxProp])
  console.log('sx itself', sx)

  // sx : Object { width: 16px, height: 16px}
  // what we want : '&[data-component="IconButton"][data-component="Overrides"] : sx & IconButon styles'

  return (
    <ButtonBase data-component="IconButton" sx={sx} {...rest} ref={forwardedRef}>
      <Icon />
    </ButtonBase>
  )
})

export {IconButton}
