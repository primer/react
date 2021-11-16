import React, {forwardRef} from 'react'
import {IconProps} from '@primer/octicons-react'
import Box from '../Box'
import styled from 'styled-components'
import sx, {merge, SxProp} from '../sx'
import {useTheme, Theme} from '../ThemeProvider'

type VariantType = 'default' | 'primary' | 'invisible' | 'danger'

export type ButtonProps = {
  /**
   * Determine's the styles on a button one of 'default' | 'primary' | 'invisible' | 'danger'
   */
  variant?: VariantType
  /**
   * Size of button and fontSize of text in button
   */
  size?: 'small' | 'medium' | 'large'
  /**
   * This is to be used if it is an icon-only button. Will make text visually hidden
   */
  icon?: React.FunctionComponent<IconProps>
  /**
   * The leading icon comes before button content
   */
  leadingIcon?: React.FunctionComponent<IconProps>
  /**
   * The trailing icon comes after button content
   */
  trailingIcon?: React.FunctionComponent<IconProps>
  /**
   * Items that are disabled can not be clicked, selected, or navigated through.
   */
  disabled?: boolean
} & SxProp

const getVariantStyles = (variant: VariantType = 'default', theme: Theme) => {
  const style = {
    default: {
      color: 'btn.text',
      backgroundColor: 'btn.bg',
      //boxShadow: `${theme?.shadows.btn.shadow}, ${theme?.shadows.btn.insetShadow}`,
      '&:hover:not([disabled])': {
        backgroundColor: 'btn.hoverBg'
      },
      // focus must come before :active so that the active box shadow overrides
      '&:focus:not([disabled])': {
        boxShadow: `${theme?.shadows.btn.focusShadow}`
      },
      '&:active:not([disabled])': {
        backgroundColor: 'btn.selectedBg',
        boxShadow: `${theme?.shadows.btn.shadowActive}`
      },
      '&:disabled': {
        color: 'primer.fg.disabled',
        backgroundColor: 'btn.disabledBg'
      }
    },
    primary: {
      color: 'btn.primary.text',
      backgroundColor: 'btn.primary.bg',
      borderColor: 'border.subtle',
      boxShadow: `${theme?.shadows.btn.primary.shadow}`,
      '&:hover:not([disabled])': {
        color: 'btn.primary.hoverText',
        backgroundColor: 'btn.primary.hoverBg'
      },
      // focus must come before :active so that the active box shadow overrides
      '&:focus:not([disabled])': {
        boxShadow: `${theme?.shadows.btn.primary.focusShadow}`
      },
      '&:active:not([disabled])': {
        backgroundColor: 'btn.primary.selectedBg',
        boxShadow: `${theme?.shadows.btn.primary.selectedShadow}`
      },
      '&:disabled': {
        color: 'btn.primary.disabledText',
        backgroundColor: 'btn.primary.disabledBg'
      }
    },
    danger: {
      color: 'btn.danger.text',
      backgroundColor: 'btn.bg',
      boxShadow: `${theme?.shadows.btn.shadow}`,
      '&:hover:not([disabled])': {
        color: 'btn.danger.hoverText',
        backgroundColor: 'btn.danger.hoverBg',
        borderColor: 'btn.danger.hoverBorder',
        boxShadow: `${theme?.shadows.btn.danger.hoverShadow}`
      },
      // focus must come before :active so that the active box shadow overrides
      '&:focus:not([disabled])': {
        borderColor: 'btn.danger.focusBorder',
        boxShadow: `${theme?.shadows.btn.danger.focusShadow}`
      },
      '&:active:not([disabled])': {
        color: 'btn.danger.selectedText',
        backgroundColor: 'btn.danger.selectedBg',
        boxShadow: `${theme?.shadows.btn.danger.selectedShadow}`,
        borderColor: 'btn.danger.selectedBorder'
      },
      '&:disabled': {
        color: 'btn.danger.disabledText',
        backgroundColor: 'btn.danger.disabledBg',
        borderColor: 'btn.danger.disabledBorder'
      }
    },
    invisible: {
      color: 'accent.fg',
      backgroundColor: 'transparent',
      border: '0',
      boxShadow: 'none',
      '&:hover:not([disabled])': {
        color: 'btn.danger.hoverText',
        backgroundColor: 'btn.danger.hoverBg',
        borderColor: 'btn.danger.hoverBorder',
        boxShadow: `${theme?.shadows.btn.danger.hoverShadow}`
      },
      // focus must come before :active so that the active box shadow overrides
      '&:focus:not([disabled])': {
        boxShadow: `${theme?.shadows.btn.focusShadow}`
      },
      '&:active:not([disabled])': {
        backgroundColor: 'btn.selectedBg'
      },
      '&:disabled': {
        color: 'primer.fg.disabled'
      }
    }
  }
  return style[variant]
}

const getSizeStyles = (size = 'medium', variant: VariantType = 'default', iconOnly: boolean) => {
  let paddingY, paddingX, fontSize
  switch (size) {
    case 'small':
      paddingY = 3
      paddingX = 12
      fontSize = 0
      break
    case 'large':
      paddingY = 9
      paddingX = 20
      fontSize = 2
      break
    case 'medium':
    default:
      paddingY = 5
      paddingX = 16
      fontSize = 1
  }
  if (iconOnly) {
    paddingX = paddingY + 2
  }
  if (variant === 'invisible') {
    paddingY = paddingY + 1
  }
  return {
    paddingY: `${paddingY}px`,
    paddingX: `${paddingX}px`,
    fontSize
  }
}

const ButtonBase = styled.button<SxProp>(sx)

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({children, ...props}, forwardedRef) => {
  const {
    icon: Icon,
    leadingIcon: LeadingIcon,
    trailingIcon: TrailingIcon,
    variant = 'default',
    size = 'medium',
    sx: sxProp = {}
  } = props
  let iconOnly = !!Icon
  const TEXT_ROW_HEIGHT = '20px' // custom value off the scale
  const {theme} = useTheme()

  const styles = {
    borderRadius: 2,
    border: '1px solid',
    borderColor: theme?.colors.btn.border,
    display: 'grid',
    gridTemplateAreas: '"leadingIcon text trailingIcon"',
    fontWeight: 'bold',
    lineHeight: TEXT_ROW_HEIGHT,
    whiteSpace: 'nowrap',
    verticalAlign: 'middle',
    cursor: 'pointer',
    appearance: 'none',
    userSelect: 'none',
    textDecoration: 'none',
    textAlign: 'center',
    '> :not(:last-child)': {
      mr: 2
    },
    ':not(\'[data-component="icon-only"]\')': {
      mr: 2
    },
    '&:focus': {
      outline: 'none'
    },
    '&:disabled': {
      cursor: 'default'
    },
    '&:disabled svg': {
      opacity: '0.6'
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

  const variableStyles = merge(styles, {...getSizeStyles(size, variant, iconOnly), ...getVariantStyles(variant, theme)})
  const iconWrapStyles = {
    display: 'inline-block'
  }
  return (
    <ButtonBase ref={forwardedRef} {...props} sx={merge(variableStyles, sxProp as SxProp)}>
      {LeadingIcon && (
        <Box as="span" data-component="leadingIcon" sx={iconWrapStyles} aria-hidden={!iconOnly}>
          <LeadingIcon />
        </Box>
      )}
      {Icon && (
        <Box data-component="icon-only" as="span" sx={{display: 'inline-block'}} aria-hidden={!iconOnly}>
          <Icon />
        </Box>
      )}
      <span data-component="text" hidden={Icon ? true : false}>
        {children}
      </span>
      {TrailingIcon && (
        <Box as="span" data-component="trailingIcon" sx={iconWrapStyles} aria-hidden={!iconOnly}>
          <TrailingIcon />
        </Box>
      )}
    </ButtonBase>
  )
})

Button.displayName = 'Button'

export default Button
