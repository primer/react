import React, {forwardRef} from 'react'
import Box from '../Box'
import {merge, SxProp} from '../sx'
import {useTheme} from '../ThemeProvider'
import {ButtonProps} from './types'
import ButtonBase from './button-base'
import {getVariantStyles, getSizeStyles, getBaseStyles} from './styles'

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({children, sx: sxProp = {}, ...props}, forwardedRef): JSX.Element => {
    const {leadingIcon: LeadingIcon, trailingIcon: TrailingIcon, variant = 'default', size = 'medium'} = props
    const {theme} = useTheme()

    const styles = {
      ...getBaseStyles(theme),
      display: 'grid',
      gridTemplateAreas: '"leadingIcon text trailingIcon"',
      '& > :not(:last-child)': {
        mr: '2'
      },
      '[data-component="leadingIcon"]': {
        gridArea: 'leadingIcon'
      },
      '[data-component="text"]': {
        gridArea: 'text'
      },
      '[data-component="trailingIcon"]': {
        gridArea: 'trailingIcon'
      }
    }
    const iconWrapStyles = {
      display: 'inline-block'
    }
    const sxStyles = merge.all([
      styles,
      getSizeStyles(size, variant, false),
      getVariantStyles(variant, theme),
      sxProp as SxProp
    ])
    return (
      <ButtonBase sx={sxStyles} ref={forwardedRef} {...props}>
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
      </ButtonBase>
    )
  }
)

Button.displayName = 'Button'

Object.assign(Button, {})

export {Button}
