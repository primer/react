import React, {forwardRef} from 'react'
import {merge, SxProp} from '../sx'
import {useTheme} from '../ThemeProvider'
import Box from '../Box'
import {IconButtonProps} from './types'
import {getBaseStyles, getSizeStyles, getVariantStyles} from './styles'
import {Base} from './button-base'

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>((props, forwardedRef): JSX.Element => {
  const {variant = 'default', size = 'medium', sx: sxProp = {}, icon: Icon, iconLabel} = props
  const {theme} = useTheme()
  const styles = {
    ...getBaseStyles(theme)
  }
  const sxStyles = merge.all([
    styles,
    getSizeStyles(size, variant, true),
    getVariantStyles(variant, theme),
    sxProp as SxProp
  ])
  return (
    <Base sx={sxStyles} ref={forwardedRef} {...props}>
      <span hidden={true}>{iconLabel}</span>
      <Box as="span" sx={{display: 'inline-block'}}>
        <Icon />
      </Box>
    </Base>
  )
})

export default IconButton
