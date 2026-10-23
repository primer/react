import {defineTheme, primerTheme} from '../experimental/defineTheme'

export const noodlesTheme = defineTheme({
  name: 'noodles',
  extends: primerTheme,
  typography: {
    fontFamily: {
      body: "'SF Pro Text', system-ui, sans-serif",
      heading: "'SF Pro Display', system-ui, sans-serif",
      monospace: 'ui-monospace, monospace',
    },
  },
  radii: {small: '4px', medium: '8px', large: '12px'},
  colorSchemes: {
    dark: {
      tokens: {
        'bgColor.default': '#101217',
        'bgColor.muted': '#191d24',
        'fgColor.default': '#e6edf3',
        'fgColor.muted': '#a1aab6',
        'borderColor.default': '#707c8c',
        'borderColor.muted': '#343b46',
        'control.fgColor.rest': '#e6edf3',
        'control.bgColor.rest': '#222833',
        'control.bgColor.hover': '#2b3340',
        'control.bgColor.active': '#343e4d',
        'control.transparent.bgColor.hover': '#2b3340',
        'control.transparent.bgColor.active': '#343e4d',
        'control.transparent.bgColor.selected': '#2b3340',
        'button.primary.fgColor.rest': '#ffffff',
        'button.primary.bgColor.rest': '#1f6feb',
        'button.primary.bgColor.hover': '#1a63cd',
        'button.primary.bgColor.active': '#1659b7',
        'button.primary.bgColor.disabled': '#343a45',
        'button.primary.borderColor.rest': '#5a9bff',
        'button.primary.borderColor.hover': '#79b8ff',
        'button.primary.borderColor.active': '#79b8ff',
        'button.primary.borderColor.disabled': '#343a45',
        'button.primary.fgColor.disabled': '#a1aab6',
        'button.primary.iconColor.disabled': '#a1aab6',
        'focus.outlineColor': '#79b8ff',
      },
    },
  },
})
