import React, {forwardRef} from 'react'
import {merge, SxProp} from '../sx'
import {useTheme} from '../ThemeProvider'
import Box from '../Box'
import {IconButtonProps, StyledButton} from './types'
import {getBaseStyles, getSizeStyles, getVariantStyles} from './styles'

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>((props, forwardedRef): JSX.Element => {
  const {variant = 'default', size = 'medium', sx: sxProp = {}, icon: Icon, ...rest} = props
  const {theme} = useTheme()
  const sxStyles = merge.all([
    getBaseStyles(theme),
    getSizeStyles(size, true),
    getVariantStyles(variant, theme),
    sxProp as SxProp
  ])
  return (
    <StyledButton data-component="IconButton" sx={sxStyles} {...rest} ref={forwardedRef}>
      <Icon />
    </StyledButton>
  )
})

export {IconButton}
