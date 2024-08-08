import type {VariantType, AlignContent} from './types'
import type {Theme} from '../ThemeProvider'

export const getVariantStyles = (variant: VariantType = 'default', theme?: Theme) => {
  const style = {
    default: {
      color: 'btn.text',
      backgroundColor: 'btn.bg',
      boxShadow: `${theme?.shadows.btn.shadow}, ${theme?.shadows.btn.insetShadow}`,
      '&:hover:not([disabled]):not([data-inactive])': {
        backgroundColor: 'btn.hoverBg',
        borderColor: `var(--button-default-borderColor-hover, ${theme?.colors.btn.hoverBorder})`,
      },
      '&:active:not([disabled]):not([data-inactive])': {
        backgroundColor: 'btn.activeBg',
        borderColor: `var(--button-default-borderColor-active, ${theme?.colors.btn.activeBorder})`,
      },
      '&:disabled': {
        color: 'primer.fg.disabled',
        borderColor: `var(--button-default-borderColor-disabled, ${theme?.colors.btn.border})`,
        backgroundColor: `var(--button-default-bgColor-disabled, ${theme?.colors.input.disabledBg})`,
        '[data-component=ButtonCounter]': {
          color: 'inherit',
        },
      },
      '&[aria-expanded=true]': {
        backgroundColor: 'btn.activeBg',
        borderColor: `var(--button-default-borderColor-active, ${theme?.colors.btn.activeBorder})`,
      },
      '[data-component="leadingVisual"], [data-component="trailingVisual"], [data-component="trailingAction"]': {
        color: `var(--button-color, ${theme?.colors.fg.muted})`,
      },
      '[data-component=ButtonCounter]': {
        backgroundColor: 'btn.counterBg',
      },
      '&[data-component="IconButton"][data-no-visuals]': {
        color: 'fg.muted',
      },
    },
    primary: {
      color: 'btn.primary.text',
      backgroundColor: 'btn.primary.bg',
      borderColor: 'btn.primary.border',
      boxShadow: `${theme?.shadows.btn.primary.shadow}`,
      '&:hover:not([disabled]):not([data-inactive])': {
        color: 'btn.primary.hoverText',
        backgroundColor: 'btn.primary.hoverBg',
      },
      '&:focus:not([disabled])': {
        boxShadow: 'inset 0 0 0 3px',
      },
      '&:focus-visible:not([disabled])': {
        boxShadow: 'inset 0 0 0 3px',
      },
      '&:active:not([disabled]):not([data-inactive])': {
        backgroundColor: 'btn.primary.selectedBg',
        boxShadow: `${theme?.shadows.btn.primary.selectedShadow}`,
      },
      '&:disabled': {
        color: 'btn.primary.disabledText',
        backgroundColor: 'btn.primary.disabledBg',
        borderColor: 'btn.primary.disabledBorder',
        '[data-component=ButtonCounter]': {
          color: 'inherit',
        },
      },
      '[data-component=ButtonCounter]': {
        backgroundColor: 'btn.primary.counterBg',
        color: 'btn.primary.text',
      },
      '&[aria-expanded=true]': {
        backgroundColor: 'btn.primary.selectedBg',
        boxShadow: `${theme?.shadows.btn.primary.selectedShadow}`,
      },
    },
    danger: {
      color: 'btn.danger.text',
      backgroundColor: 'btn.bg',
      boxShadow: `${theme?.shadows.btn.shadow}`,
      '&:hover:not([disabled]):not([data-inactive])': {
        color: 'btn.danger.hoverText',
        backgroundColor: 'btn.danger.hoverBg',
        borderColor: 'btn.danger.hoverBorder',
        boxShadow: `${theme?.shadows.btn.danger.hoverShadow}`,
        '[data-component=ButtonCounter]': {
          backgroundColor: 'btn.danger.hoverCounterBg',
          color: 'btn.danger.hoverCounterFg',
        },
      },
      '&:active:not([disabled]):not([data-inactive])': {
        color: 'btn.danger.selectedText',
        backgroundColor: 'btn.danger.selectedBg',
        boxShadow: `${theme?.shadows.btn.danger.selectedShadow}`,
        borderColor: 'btn.danger.selectedBorder',
      },
      '&:disabled': {
        color: 'btn.danger.disabledText',
        backgroundColor: 'btn.danger.disabledBg',
        borderColor: `var(--button-default-borderColor-disabled, ${theme?.colors.btn.border})`,
        '[data-component=ButtonCounter]': {
          color: 'btn.danger.disabledCounterFg',
          backgroundColor: 'btn.danger.disabledCounterBg',
        },
      },
      '[data-component=ButtonCounter]': {
        color: 'btn.danger.counterFg',
        backgroundColor: 'btn.danger.counterBg',
      },
      '&[aria-expanded=true]': {
        color: 'btn.danger.selectedText',
        backgroundColor: 'btn.danger.selectedBg',
        boxShadow: `${theme?.shadows.btn.danger.selectedShadow}`,
        borderColor: 'btn.danger.selectedBorder',
      },
    },
    invisible: {
      color: 'btn.text',
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      boxShadow: 'none',
      '&:hover:not([disabled])': {
        backgroundColor: 'actionListItem.default.hoverBg',
      },
      '&:active:not([disabled])': {
        backgroundColor: 'actionListItem.default.activeBg',
      },
      '&:disabled': {
        color: 'primer.fg.disabled',
        '[data-component=ButtonCounter], [data-component="leadingVisual"], [data-component="trailingAction"]': {
          color: 'inherit',
        },
      },
      '&[aria-expanded=true]': {
        backgroundColor: 'actionListItem.default.selectedBg',
      },
      '&[data-component="IconButton"][data-no-visuals]': {
        color: 'fg.muted',
      },
      '[data-component="trailingAction"]': {
        color: 'fg.muted',
      },
      '[data-component="leadingVisual"]': {
        color: 'fg.muted',
      },
      '&[data-no-visuals]': {
        color: 'accent.fg',
      },
      '&:has([data-component="ButtonCounter"])': {
        color: 'btn.text',
      },
      '&:disabled[data-no-visuals]': {
        color: 'primer.fg.disabled',
        '[data-component=ButtonCounter]': {
          color: 'inherit',
        },
      },
    },
    outline: {
      color: 'btn.outline.text',
      boxShadow: `${theme?.shadows.btn.shadow}`,
      borderColor: `var(--button-default-borderColor-rest, ${theme?.colors.btn.border})`,
      backgroundColor: 'btn.bg',

      '&:hover:not([disabled]):not([data-inactive])': {
        color: 'btn.outline.hoverText',
        backgroundColor: 'btn.outline.hoverBg',
        borderColor: `${theme?.colors.btn.outline.hoverBorder}`,
        boxShadow: `${theme?.shadows.btn.outline.hoverShadow}`,
        '[data-component=ButtonCounter]': {
          backgroundColor: 'btn.outline.hoverCounterBg',
          color: 'btn.outline.hoverCounterFg',
        },
      },
      '&:active:not([disabled]):not([data-inactive])': {
        color: 'btn.outline.selectedText',
        backgroundColor: 'btn.outline.selectedBg',
        boxShadow: `${theme?.shadows.btn.outline.selectedShadow}`,
        borderColor: `${theme?.colors.btn.outline.selectedBorder}`,
      },

      '&:disabled': {
        color: 'btn.outline.disabledText',
        backgroundColor: 'btn.outline.disabledBg',
        borderColor: 'btn.border',
        '[data-component=ButtonCounter]': {
          backgroundColor: 'btn.outline.disabledCounterBg',
          color: 'btn.outline.disabledCounterFg',
        },
      },
      '[data-component=ButtonCounter]': {
        backgroundColor: 'btn.outline.counterBg',
        color: 'btn.outline.counterFg',
      },
      '&[aria-expanded=true]': {
        color: 'btn.outline.selectedText',
        backgroundColor: 'btn.outline.selectedBg',
        boxShadow: `${theme?.shadows.btn.outline.selectedShadow}`,
        borderColor: `var(--button-default-borderColor-active, ${theme?.colors.btn.outline.selectedBorder})`,
      },
    },
    link: {
      color: 'var(--fgColor-link)',
      display: 'inline-block',
      fontSize: 'inherit',
      border: 'none',
      height: 'unset',
      padding: '0',
      minWidth: 'fit-content',
      backgroundColor: 'transparent',

      '&:hover:not([disabled]):not([data-inactive])': {
        textDecoration: 'underline',
      },

      '&:focus-visible:not([disabled])': {
        outlineOffset: '2px',
      },

      '&:disabled': {
        color: 'primer.fg.disabled',
        '[data-component=ButtonCounter], [data-component="leadingVisual"], [data-component="trailingAction"]': {
          color: 'inherit',
        },
      },

      '[data-component="text"]': {
        whiteSpace: 'unset',
      },
    },
  }

  return style[variant]
}

export const getBaseStyles = (theme?: Theme) => ({
  borderRadius: '2',
  border: '1px solid',
  borderColor: `var(--button-default-borderColor-rest, ${theme?.colors.btn.border})`,
  fontFamily: 'inherit',
  fontWeight: 'semibold',
  fontSize: '1',
  cursor: 'pointer',
  appearance: 'none',
  userSelect: 'none',
  textDecoration: 'none',
  textAlign: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: '32px',
  padding: '0 12px',
  gap: '8px',
  minWidth: 'max-content',
  transition: '80ms cubic-bezier(0.65, 0, 0.35, 1)',
  transitionProperty: 'color, fill, background-color, border-color',
  '&[href]': {
    display: 'inline-flex',
    '&:hover': {
      textDecoration: 'none',
    },
  },
  '&:hover': {
    transitionDuration: '80ms',
  },
  '&:active': {
    transition: 'none',
  },
  '&[data-inactive]': {
    cursor: 'auto',
  },
  '&:disabled': {
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
  '@media (forced-colors: active)': {
    '&:focus': {
      // Support for Windows high contrast https://sarahmhigley.com/writing/whcm-quick-tips
      outline: 'solid 1px transparent',
    },
  },
  '[data-component=ButtonCounter]': {
    fontSize: '0',
  },
  '&[data-component=IconButton]': {
    display: 'inline-grid',
    padding: 'unset',
    placeContent: 'center',
    width: '32px',
    minWidth: 'unset',
  },
  '&[data-size="small"]': {
    padding: '0 8px',
    height: '28px',
    gap: '4px',
    fontSize: '0',

    '[data-component="text"]': {
      lineHeight: 'calc(20 / 12)',
    },

    '[data-component=ButtonCounter]': {
      fontSize: '0',
    },

    '[data-component="buttonContent"] > :not(:last-child)': {
      mr: '4px',
    },

    '&[data-component=IconButton]': {
      width: '28px',
      padding: 'unset',
    },
  },
  '&[data-size="large"]': {
    padding: '0 16px',
    height: '40px',
    gap: '8px',

    '[data-component="buttonContent"] > :not(:last-child)': {
      mr: '8px',
    },

    '&[data-component=IconButton]': {
      width: '40px',
      padding: 'unset',
    },
  },
})

export const getButtonStyles = (theme?: Theme) => {
  const styles = {
    ...getBaseStyles(theme),
    '&[data-block="block"]': {
      width: '100%',
    },
    '&[data-label-wrap="true"]': {
      minWidth: 'fit-content',
      height: 'unset',
      minHeight: 'var(--control-medium-size, 2rem)',

      '[data-component="buttonContent"]': {
        flex: '1 1 auto',
        alignSelf: 'stretch',
        paddingBlock: 'calc(var(--control-medium-paddingBlock, 0.375rem) - 2px)',
      },

      '[data-component="text"]': {
        whiteSpace: 'unset',
        wordBreak: 'break-word',
      },

      '&[data-size="small"]': {
        height: 'unset',
        minHeight: 'var(--control-small-size, 1.75rem)',

        '[data-component="buttonContent"]': {
          paddingBlock: 'calc(var(--control-small-paddingBlock, 0.25rem) - 2px)',
        },
      },

      '&[data-size="large"]': {
        height: 'unset',
        minHeight: 'var(--control-large-size, 2.5rem)',
        paddingInline: 'var(--control-large-paddingInline-spacious, 1rem)',

        '[data-component="buttonContent"]': {
          paddingBlock: 'calc(var(--control-large-paddingBlock, 0.625rem) - 2px)',
        },
      },
    },
    '&[data-inactive]:not([disabled])': {
      backgroundColor: `var(--button-inactive-bgColor, ${theme?.colors.btn.inactive.bg})`,
      borderColor: `var(--button-inactive-bgColor, ${theme?.colors.btn.inactive.bg})`,
      color: `var(--button-inactive-fgColor, ${theme?.colors.btn.inactive.text})`,
    },
    '&[data-inactive]:not([disabled]):focus-visible': {
      boxShadow: 'none',
    },
    '[data-component="leadingVisual"]': {
      gridArea: 'leadingVisual',
    },
    '[data-component="text"]': {
      gridArea: 'text',
      lineHeight: 'calc(20/14)',
      whiteSpace: 'nowrap',
    },
    '[data-component="trailingVisual"]': {
      gridArea: 'trailingVisual',
    },
    '[data-component="trailingAction"]': {
      marginRight: '-4px',
    },
    '[data-component="buttonContent"]': {
      flex: '1 0 auto',
      display: 'grid',
      gridTemplateAreas: '"leadingVisual text trailingVisual"',
      gridTemplateColumns: 'min-content minmax(0, auto) min-content',
      alignItems: 'center',
      alignContent: 'center',
    },
    '[data-component="buttonContent"] > :not(:last-child)': {
      mr: '8px',
    },
    '[data-component="loadingSpinner"]': {
      gridArea: 'text',
      marginRight: '0px !important',
      placeSelf: 'center',
    },
    '[data-component="loadingSpinner"] + [data-component="text"]': {
      visibility: 'hidden',
    },
  }
  return styles
}

export const getAlignContentSize = (alignContent: AlignContent = 'center') => ({
  justifyContent: alignContent === 'center' ? 'center' : 'flex-start',
})
