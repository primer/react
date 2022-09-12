import React, {ComponentPropsWithRef, forwardRef, useMemo} from 'react'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import Box from '../Box'
import {merge, SxProp} from '../sx'
import {useTheme} from '../ThemeProvider'
import {ButtonProps, StyledButton} from './types'
import {getVariantStyles, getSizeStyles, getButtonStyles} from './styles'

const ButtonBase = forwardRef<HTMLElement, ButtonProps>(
  ({children, as: Component = 'button', sx: sxProp = {}, ...props}, forwardedRef): JSX.Element => {
    const {leadingIcon: LeadingIcon, trailingIcon: TrailingIcon, variant = 'default', size = 'medium'} = props
    const {theme} = useTheme()
    const iconWrapStyles = {
      display: 'inline-block'
    }
    const sxStyles = useMemo(() => {
      return merge.all([getButtonStyles(theme), getSizeStyles(size, variant, false), getVariantStyles(variant, theme)])
    }, [theme, size, variant])
    return (
      <StyledButton as={Component} sx={merge(sxStyles, sxProp as SxProp)} {...props} ref={forwardedRef}>
        {LeadingIcon && (
          <Box as="span" data-component="leadingIcon" sx={iconWrapStyles}>
            <LeadingIcon />
          </Box>
        )}
        {children && <span data-component="text">{children}</span>}
        {TrailingIcon && (
          <Box as="span" data-component="trailingIcon" sx={{...iconWrapStyles, ml: 2}}>
            <TrailingIcon />
          </Box>
        )}
      </StyledButton>
    )
  }
) as PolymorphicForwardRefComponent<'button' | 'a', ButtonProps>

export type ButtonBaseProps = ComponentPropsWithRef<typeof ButtonBase>

export {ButtonBase}
