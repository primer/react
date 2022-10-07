import {VariantType, AlignContent} from './types'
import {Theme} from '../ThemeProvider'

export const TEXT_ROW_HEIGHT = '20px' // custom value off the scale

export const getVariantStyles = (variant: VariantType = 'default', theme?: Theme) => {
  const style = {
    default: {
      color: 'btn.text',
      backgroundColor: 'btn.bg',
      boxShadow: `${theme?.shadows.btn.shadow}, ${theme?.shadows.btn.insetShadow}`,
      '&:hover:not([disabled])': {
        backgroundColor: 'btn.hoverBg',
        borderColor: 'btn.hoverBorder'
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
      borderColor: 'btn.primary.border',
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
      borderColor: 'transparent',
      boxShadow: 'none',
      '&:hover:not([disabled])': {
        backgroundColor: `actionListItem.default.hoverBg`
      },
      '&:active:not([disabled])': {
        backgroundColor: 'actionListItem.default.activeBg'
      },
      '&:disabled': {
        color: 'primer.fg.disabled',
        '[data-component=ButtonCounter]': {
          color: 'inherit'
        }
      },
      '&[aria-expanded=true]': {
        backgroundColor: 'actionListItem.default.selectedBg'
      },
      svg: {
        color: 'fg.muted'
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
  minWidth: 'max-content',
  transition: '80ms cubic-bezier(0.65, 0, 0.35, 1)',
  transitionProperty: 'color, fill, background-color, border-color',
  '&[href]': {
    display: 'inline-flex',
    '&:hover': {
      textDecoration: 'none'
    }
  },
  '&:hover': {
    transitionDuration: '80ms'
  },
  '&:active': {
    transition: 'none'
  },
  '&:disabled': {
    cursor: 'not-allowed',
    boxShadow: 'none'
  },
  '@media (forced-colors: active)': {
    '&:focus': {
      // Support for Windows high contrast https://sarahmhigley.com/writing/whcm-quick-tips
      outline: 'solid 1px transparent'
    }
  },
  '[data-component=ButtonCounter]': {
    fontSize: 'var(--primer-text-body-size-medium, 14px)'
  },
  '&[data-component=IconButton]': {
    display: 'grid',
    padding: 'unset',
    placeContent: 'center',
    width: 'var(--primer-control-medium-size, 32px)'
  },
  '&[data-size="small"]': {
    padding: '0 var(--primer-control-small-paddingInline-condensed, 8px)',
    height: 'var(--primer-control-small-size, 28px)',
    gap: 'var(--primer-control-small-gap, 4px)',
    fontSize: 'var(--primer-text-body-size-small, 12px)',

    '[data-component="text"]': {
      lineHeight: 'var(--primer-text-body-lineHeight-small, calc(20 / 12))'
    },

    '[data-component=ButtonCounter]': {
      fontSize: 'var(--primer-text-body-size-small, 12px)'
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
    '[data-component="leadingVisual"]': {
      gridArea: 'leadingVisual'
    },
    '[data-component="text"]': {
      gridArea: 'text',
      lineHeight: 'var(--primer-text-body-lineHeight-medium, calc(20/14))',
      whiteSpace: 'nowrap'
    },
    '[data-component="trailingVisual"]': {
      gridArea: 'trailingVisual'
    },
    '[data-component="trailingAction"]': {
      marginRight: 'calc(var(--base-size-4, 4px) * -1)'
    },
    '[data-component="buttonContent"]': {
      flex: '1 0 auto',
      display: 'grid',
      gridTemplateAreas: '"leadingVisual text trailingVisual"',
      gridTemplateColumns: 'min-content minmax(0, auto) min-content',
      alignItems: 'center',
      alignContent: 'center'
    },
    '[data-component="buttonContent"] > :not(:last-child)': {
      mr: 'var(--primer-control-medium-gap, 8px)'
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
