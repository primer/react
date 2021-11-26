import React, {forwardRef} from 'react'
import styled from 'styled-components'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '@radix-ui/react-polymorphic'
import Box from '../Box'
import sx, {merge, SxProp} from '../sx'
import {useTheme} from '../ThemeProvider'
import {ButtonProps} from './types'
import {getVariantStyles, getSizeStyles, getButtonStyles} from './styles'

export const Base = styled.button<SxProp>(sx)

const ButtonBase = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({children, as: Component = 'button', sx: sxProp = {}, ...props}, forwardedRef): JSX.Element => {
    const {leadingIcon: LeadingIcon, trailingIcon: TrailingIcon, variant = 'default', size = 'medium'} = props
    const {theme} = useTheme()
    const iconWrapStyles = {
      display: 'inline-block'
    }
    const sxStyles = merge.all([
      getButtonStyles(theme),
      getSizeStyles(size, variant, false),
      getVariantStyles(variant, theme),
      sxProp as SxProp
    ])
    return (
      <Box as={Component} sx={sxStyles} {...props} ref={forwardedRef}>
        {LeadingIcon && (
          <Box as="span" data-component="leadingIcon" sx={iconWrapStyles}>
            <LeadingIcon />
          </Box>
        )}
        <span data-component="text">{children}</span>
        {TrailingIcon && (
          <Box as="span" data-component="trailingIcon" sx={{...iconWrapStyles, ml: 2}}>
            <TrailingIcon />
          </Box>
        )}
      </Box>
    )
  }
) as PolymorphicForwardRefComponent<'button', ButtonProps>

export default ButtonBase
