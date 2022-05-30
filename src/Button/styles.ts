import {VariantType} from './types'
import {Theme} from '../ThemeProvider'

export const TEXT_ROW_HEIGHT = '20px' // custom value off the scale

export const getVariantStyles = (variant: VariantType = 'default', theme?: Theme) => {
  const style = {
    default: {
      color: 'btn.text',
      backgroundColor: 'btn.bg',
      boxShadow: `${theme?.shadows.btn.shadow}, ${theme?.shadows.btn.insetShadow}`,
      '&:hover:not([disabled])': {
        backgroundColor: 'btn.hoverBg'
      },
      '&:active:not([disabled])': {
        backgroundColor: 'btn.activeBg',
        borderColor: 'btn.activeBorder'
      },
      '&:disabled': {
        color: 'primer.fg.disabled',
        '[data-component=ButtonCounter]': {
          color: 'inherit'
        }
      },
      '&[aria-expanded=true]': {
        backgroundColor: 'btn.activeBg',
        borderColor: 'btn.activeBorder'
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
      '&:focus:not([disabled])': {
        boxShadow: 'inset 0 0 0 3px'
      },
      '&:focus-visible:not([disabled])': {
        boxShadow: 'inset 0 0 0 3px'
      },
      '&:active:not([disabled])': {
        backgroundColor: 'btn.primary.selectedBg',
        boxShadow: `${theme?.shadows.btn.primary.selectedShadow}`
      },
      '&:disabled': {
        color: 'btn.primary.disabledText',
        backgroundColor: 'btn.primary.disabledBg',
        '[data-component=ButtonCounter]': {
          color: 'inherit'
        }
      },
      '[data-component=ButtonCounter]': {
        backgroundColor: 'btn.primary.counterBg',
        color: 'btn.primary.text'
      },
      '&[aria-expanded=true]': {
        backgroundColor: 'btn.primary.selectedBg',
        boxShadow: `${theme?.shadows.btn.primary.selectedShadow}`
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
        '[data-component=ButtonCounter]': {
          backgroundColor: 'btn.danger.hoverCounterBg',
          color: 'btn.danger.hoverText'
        }
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
        '[data-component=ButtonCounter]': {
          color: 'inherit',
          backgroundColor: 'btn.danger.disabledCounterBg'
        }
      },
      '[data-component=ButtonCounter]': {
        color: 'btn.danger.text',
        backgroundColor: 'btn.danger.counterBg'
      },
      '&[aria-expanded=true]': {
        color: 'btn.danger.selectedText',
        backgroundColor: 'btn.danger.selectedBg',
        boxShadow: `${theme?.shadows.btn.danger.selectedShadow}`,
        borderColor: 'btn.danger.selectedBorder'
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
      '&:active:not([disabled])': {
        backgroundColor: 'btn.selectedBg'
      },
      '&:disabled': {
        color: 'primer.fg.disabled',
        '[data-component=ButtonCounter]': {
          color: 'inherit'
        }
      },
      '&[aria-expanded=true]': {
        backgroundColor: 'btn.selectedBg'
      }
    },
    outline: {
      color: 'btn.outline.text',
      boxShadow: `${theme?.shadows.btn.shadow}`,
      borderColor: 'btn.border',
      backgroundColor: 'btn.bg',

      '&:hover:not([disabled])': {
        color: 'btn.outline.hoverText',
        backgroundColor: 'btn.outline.hoverBg',
        borderColor: 'outline.hoverBorder',
        boxShadow: `${theme?.shadows.btn.outline.hoverShadow}`,
        '[data-component=ButtonCounter]': {
          backgroundColor: 'btn.outline.hoverCounterBg',
          color: 'inherit'
        }
      },
      '&:active:not([disabled])': {
        color: 'btn.outline.selectedText',
        backgroundColor: 'btn.outline.selectedBg',
        boxShadow: `${theme?.shadows.btn.outline.selectedShadow}`,
        borderColor: 'btn.outline.selectedBorder'
      },

      '&:disabled': {
        color: 'btn.outline.disabledText',
        backgroundColor: 'btn.outline.disabledBg',
        borderColor: 'btn.border',
        '[data-component=ButtonCounter]': {
          backgroundColor: 'btn.outline.disabledCounterBg',
          color: 'inherit'
        }
      },
      '[data-component=ButtonCounter]': {
        backgroundColor: 'btn.outline.counterBg',
        color: 'btn.outline.text'
      },
      '&[aria-expanded=true]': {
        color: 'btn.outline.selectedText',
        backgroundColor: 'btn.outline.selectedBg',
        boxShadow: `${theme?.shadows.btn.outline.selectedShadow}`,
        borderColor: 'btn.outline.selectedBorder'
      }
    }
  }
  return style[variant]
}

/* The button heights have to amount to 
  small - 28
  medium - 32
  large - 34
  In icon these have to be square.
*/
export const getSizeStyles = (size = 'medium', variant: VariantType = 'default', iconOnly: boolean) => {
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
    // when `size !== 'medium'`, vertical alignment of the icon is thrown off
    // because changing the font size draws an em-box that does not match the
    // bounding box of the SVG
    fontSize = 1
    paddingX = paddingY + 3 // to make it a square
  }
  if (variant === 'invisible') {
    paddingY = paddingY + 1 // to make up for absence of border
  }
  return {
    paddingY: `${paddingY}px`,
    paddingX: `${paddingX}px`,
    fontSize,
    '[data-component=ButtonCounter]': {
      fontSize
    }
  }
}

export const getBaseStyles = (theme?: Theme) => ({
  borderRadius: '2',
  border: '1px solid',
  borderColor: theme?.colors.btn.border,
  fontFamily: 'inherit',
  fontWeight: 'bold',
  lineHeight: TEXT_ROW_HEIGHT,
  whiteSpace: 'nowrap',
  verticalAlign: 'middle',
  cursor: 'pointer',
  appearance: 'none',
  userSelect: 'none',
  textDecoration: 'none',
  textAlign: 'center',
  '&:disabled': {
    cursor: 'default'
  },
  '&:disabled svg': {
    opacity: '0.6'
  },
  '@media (forced-colors: active)': {
    '&:focus': {
      // Support for Windows high contrast https://sarahmhigley.com/writing/whcm-quick-tips
      outline: 'solid 1px transparent'
    }
  }
})

export const getButtonStyles = (theme?: Theme) => {
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
  return styles
}
