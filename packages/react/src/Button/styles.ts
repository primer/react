import type {VariantType, AlignContent} from './types'
import type {Theme} from '../ThemeProvider'

export const getVariantStyles = (variant: VariantType = 'default', theme?: Theme) => {
  const style = {
    default: {},
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
  }

  return style[variant]
}

export const getAlignContentSize = (alignContent: AlignContent = 'center') => ({
  justifyContent: alignContent === 'center' ? 'center' : 'flex-start',
})
