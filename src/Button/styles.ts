import {VariantType, AlignContent} from './types'
import {Theme} from '../ThemeProvider'
import {background} from 'styled-system'

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

export const getBaseStyles = (theme?: Theme) => ({
  borderRadius: '2',
  border: '1px solid',
  borderColor: theme?.colors.btn.border,
  fontFamily: 'inherit',
  fontWeight: 'var(--base-text-weight-medium, 500)',
  fontSize: 'var(--primer-text-body-size-medium, 14px)',
  cursor: 'pointer',
  appearance: 'none',
  userSelect: 'none',
  textDecoration: 'none',
  textAlign: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: 'var(--primer-control-medium-size, 32px)',
  padding: '0 var(--primer-control-medium-paddingInline-normal, 12px)',
  gap: 'var(--primer-control-medium-gap, 8px)',
  '&:disabled': {
    cursor: 'not-allowed'
  },
  '&:disabled svg': {
    opacity: '0.6'
  },
  '@media (forced-colors: active)': {
    '&:focus': {
      // Support for Windows high contrast https://sarahmhigley.com/writing/whcm-quick-tips
      outline: 'solid 1px transparent'
    }
  },
  '&[data-component=IconButton]': {
    display: 'grid',
    padding: 'initial',
    placeContent: 'center'
  },
  '&[data-size="small"]': {
    padding: '0 var(--primer-control-small-paddingInline-condensed, 8px)',
    height: 'var(--primer-control-small-size, 28px)',
    gap: 'var(--primer-control-small-gap, 4px)',
    fontSize: 'var(--primer-text-body-size-small, 12px)',

    '[data-component="text"]': {
      lineHeight: 'var(--primer-text-body-lineHeight-small, calc(20 / 12))'
    },

    '[data-component="buttonContent"] > :not(:last-child)': {
      mr: 'var(--primer-control-small-gap, 4px)'
    },

    '&[data-component=IconButton]': {
      width: 'var(--primer-control-small-size, 28px)',
      padding: 'unset'
    }
  },
  '&[data-size="large"]': {
    padding: '0 var(--primer-control-large-paddingInline-spacious, 16px)',
    height: 'var(--primer-control-large-size, 40px)',
    gap: 'var(--primer-control-large-gap, 8px)',

    '[data-component="buttonContent"] > :not(:last-child)': {
      mr: 'var(--primer-control-large-gap, 8px)'
    },

    '&[data-component=IconButton]': {
      width: 'var(--primer-control-large-size, 40px)',
      padding: 'unset'
    }
  }
})

export const getButtonStyles = (theme?: Theme) => {
  const styles = {
    ...getBaseStyles(theme),
    '&[data-component="block"]': {
      width: '100%'
    },
    '[data-component="Icon"]': {
      backgroundColor: 'pink'
    },
    '[data-component="leadingIcon"]': {
      gridArea: 'leadingIcon'
    },
    '[data-component="text"]': {
      gridArea: 'text',
      lineHeight: 'var(--primer-text-body-lineHeight-medium, calc(20/14))',
      whiteSpace: 'nowrap'
    },
    '[data-component="trailingIcon"]': {
      gridArea: 'trailingIcon'
    },
    '[data-component="trailingAction"]': {
      marginRight: '-4px'
    },
    '[data-component="buttonContent"]': {
      flex: '1 0 auto',
      display: 'grid',
      gridTemplateAreas: '"leadingIcon text trailingIcon"',
      gridTemplateColumns: 'min-content minmax(0, auto) min-content',
      alignItems: 'center',
      alignContent: 'center'
    },
    '[data-component="buttonContent"] > :not(:last-child)': {
      mr: '2'
    }
  }
  return styles
}

export const getAlignContentSize = (alignContent: AlignContent = 'center') => {
  const style = {
    center: {
      justifyContent: 'center'
    },
    start: {
      justifyContent: 'flex-start'
    }
  }
  return style[alignContent]
}
