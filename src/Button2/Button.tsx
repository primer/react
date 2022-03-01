import React, {ComponentPropsWithRef, forwardRef, ComponentType} from 'react'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '@radix-ui/react-polymorphic'
import Box from '../Box'
import {merge, SxProp} from '../sx'
import {useTheme} from '../ThemeProvider'
import {ButtonProps as ButtonComponentProps, StyledButton} from './types'
import {getVariantStyles, getSizeStyles, getButtonStyles} from './styles'

const Button = forwardRef<HTMLElement, ButtonComponentProps>(
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
      <StyledButton as={Component} sx={sxStyles} {...props} ref={forwardedRef}>
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) as PolymorphicForwardRefComponent<string | ComponentType<any> | undefined, ButtonComponentProps>

export type ButtonProps = ComponentPropsWithRef<typeof Button>

export {Button}
