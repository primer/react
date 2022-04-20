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
    getSizeStyles(size, variant, true),
    getVariantStyles(variant, theme),
    // when `size !== 'medium'`, vertical alignment of the icon is thrown off
    // because changing the font size draws an em-box that does not match the
    // bounding box of the SVG
    {fontSize: 1},
    sxProp as SxProp
  ])
  return (
    <StyledButton sx={sxStyles} {...rest} ref={forwardedRef}>
      <Box as="span" sx={{display: 'inline-block'}}>
        <Icon />
      </Box>
    </StyledButton>
  )
})

export {IconButton}
