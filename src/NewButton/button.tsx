import React, {forwardRef} from 'react'
import Box from '../Box'
import styled from 'styled-components'
import sx, {merge, SxProp} from '../sx'
import {useTheme, Theme} from '../ThemeProvider'
import {VariantType, ButtonProps} from './types'

const getVariantStyles = (variant: VariantType = 'default', theme?: Theme) => {
  const style = {
    default: {
      color: 'btn.text',
      backgroundColor: 'btn.bg',
      boxShadow: `${theme?.shadows.btn.shadow}, ${theme?.shadows.btn.insetShadow}`,
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
      },
      '[data-component="ButtonCounter"]': {
        backgroundColor: 'btn.primary.counterBg',
        color: 'btn.primary.text'
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
        boxShadow: `${theme?.shadows.btn.danger.hoverShadow}`,
        '[data-component="ButtonCounter"]': {
          backgroundColor: 'btn.danger.hoverCounterBg',
          color: 'btn.danger.hoverText'
        }
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
        borderColor: 'btn.danger.disabledBorder',
        '[data-component="ButtonCounter"]': {
          backgroundColor: 'btn.danger.disabledCounterBg'
        }
      },
      '[data-component="ButtonCounter"]': {
        color: 'btn.danger.text',
        backgroundColor: 'btn.danger.counterBg'
      }
    },
    invisible: {
      color: 'accent.fg',
      backgroundColor: 'transparent',
      border: '0',
      boxShadow: 'none',
      '&:hover:not([disabled])': {
        backgroundColor: 'btn.hoverBg'
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
    },
    outline: {
      color: 'btn.outline.text',
      boxShadow: `${theme?.shadows.btn.shadow}`,

      '&:hover': {
        color: 'btn.outline.hoverText',
        backgroundColor: 'btn.outline.hoverBg',
        borderColor: 'outline.hoverBorder',
        boxShadow: `${theme?.shadows.btn.outline.hoverShadow}`,
        '[data-component="ButtonCounter"]': {
          backgroundColor: 'btn.outline.hoverCounterBg',
          color: 'btn.outline.hoverText'
        }
      },
      // focus must come before :active so that the active box shadow overrides
      '&:focus': {
        borderColor: 'btn.outline.focusBorder',
        boxShadow: `${theme?.shadows.btn.outline.focusShadow}`
      },

      '&:active': {
        color: 'btn.outline.selectedText',
        backgroundColor: 'btn.outline.selectedBg',
        boxShadow: `${theme?.shadows.btn.outline.selectedShadow}`,
        borderColor: 'btn.outline.selectedBorder'
      },

      '&:disabled': {
        color: 'btn.outline.disabledText',
        backgroundColor: 'btn.outline.disabledBg',
        borderColor: 'btn.border',
        '[data-component="ButtonCounter"]': {
          backgroundColor: 'btn.outline.disabledCounterBg'
        }
      },
      '[data-component="ButtonCounter"]': {
        backgroundColor: 'btn.outline.counterBg',
        color: 'btn.outline.text'
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
    fontSize,
    '[data-component="ButtonCounter"]': {
      fontSize
    }
  }
}

const ButtonBase = styled.button<SxProp>(sx)

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({children, ...props}, forwardedRef): JSX.Element => {
  const {
    icon: Icon,
    leadingIcon: LeadingIcon,
    trailingIcon: TrailingIcon,
    variant = 'default',
    size = 'medium',
    sx: sxProp = {}
  } = props
  const iconOnly = !!Icon
  const TEXT_ROW_HEIGHT = '20px' // custom value off the scale
  const {theme} = useTheme()

  const styles = {
    borderRadius: '2',
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
    '& > :not(:last-child)': {
      mr: '2'
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
  const variableStyles = {...getSizeStyles(size, variant, iconOnly), ...getVariantStyles(variant, theme)}
  const componentStyles = {...styles, ...variableStyles}
  const iconWrapStyles = {
    display: 'inline-block'
  }
  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore Why wont it accept the sx prop?
    <ButtonBase sx={merge(componentStyles, sxProp as SxProp)} ref={forwardedRef} {...props}>
      {LeadingIcon && (
        <Box as="span" data-component="leadingIcon" sx={iconWrapStyles} aria-hidden={!iconOnly}>
          <LeadingIcon />
        </Box>
      )}
      <span data-component="text" hidden={Icon ? true : undefined}>
        {children}
      </span>
      {Icon && (
        <Box data-component="icon-only" as="span" sx={{display: 'inline-block'}} aria-hidden={!iconOnly}>
          <Icon />
        </Box>
      )}
      {TrailingIcon && (
        <Box as="span" data-component="trailingIcon" sx={{...iconWrapStyles, ml: 2}} aria-hidden={!iconOnly}>
          <TrailingIcon />
        </Box>
      )}
    </ButtonBase>
  )
})

Button.displayName = 'Button'

Object.assign(Button, {})

export {Button}
