import React, {forwardRef} from 'react'
import {merge, SxProp} from '../sx'
import {useTheme} from '../ThemeProvider'
import Box from '../Box'
import {IconButtonProps, StyledButton} from './types'
import {getBaseStyles, getSizeStyles, getVariantStyles} from './styles'
import {useSSRSafeId} from '@react-aria/ssr'

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>((props, forwardedRef): JSX.Element => {
  const {variant = 'default', size = 'medium', sx: sxProp = {}, icon: Icon, iconLabel, ...rest} = props
  const iconLabelId = useSSRSafeId()
  const {theme} = useTheme()
  const sxStyles = merge.all([
    getBaseStyles(theme),
    getSizeStyles(size, variant, true),
    getVariantStyles(variant, theme),
    sxProp as SxProp
  ])
  return (
    <StyledButton aria-labelledby={iconLabelId} sx={sxStyles} {...rest} ref={forwardedRef}>
      <span id={iconLabelId} hidden={true}>
        {iconLabel}
      </span>
      <Box as="span" sx={{display: 'inline-block'}}>
        <Icon />
      </Box>
    </StyledButton>
  )
})

export {IconButton}
