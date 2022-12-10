import React, {forwardRef} from 'react'
import {merge, SxProp} from '../sx'
import {useTheme} from '../ThemeProvider'
import Box from '../Box'
import {IconButtonProps, StyledButton} from './types'
import {getBaseStyles, getSizeStyles, getVariantStyles} from './styles'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {defaultSxProp} from '../utils/defaultSxProp'

const IconButton = forwardRef((props, forwardedRef): JSX.Element => {
  const {variant = 'default', size = 'medium', sx: sxProp = defaultSxProp, icon: Icon, ...rest} = props
  const {theme} = useTheme()
  const sxStyles = merge.all([
    getBaseStyles(theme),
    getSizeStyles(size, variant, true),
    getVariantStyles(variant, theme),
    sxProp as SxProp,
  ])
  return (
    <StyledButton sx={sxStyles} {...rest} ref={forwardedRef}>
      <Box as="span" sx={{display: 'inline-block'}}>
        <Icon />
      </Box>
    </StyledButton>
  )
}) as PolymorphicForwardRefComponent<'button' | 'a', IconButtonProps>

export {IconButton}
