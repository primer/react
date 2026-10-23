import {defineTheme, primerTheme} from '../experimental/defineTheme'

// Gruvbox Material ramps from github/github-ui packages/noodles-ui at
// 62c0bd736e0d3ca951346a1c885f30089ff62a08. Muted text and control borders
// are adjusted for contrast against the supported control states.
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
        'bgColor.default': '#292828',
        'bgColor.muted': '#2b2a2a',
        'fgColor.default': '#d4be98',
        'fgColor.muted': '#baa37e',
        'borderColor.default': '#887c67',
        'borderColor.muted': '#33312f',
        'control.fgColor.rest': '#d4be98',
        'control.bgColor.rest': '#2b2a2a',
        'control.bgColor.hover': '#33302e',
        'control.bgColor.active': '#403b36',
        'control.transparent.bgColor.hover': '#33302e',
        'control.transparent.bgColor.active': '#403b36',
        'control.transparent.bgColor.selected': '#33302e',
        'button.primary.fgColor.rest': '#292828',
        'button.primary.bgColor.rest': '#a7b364',
        'button.primary.bgColor.hover': '#a9b665',
        'button.primary.bgColor.active': '#a0ac61',
        'button.primary.bgColor.disabled': '#2b2a2a',
        'button.primary.borderColor.rest': '#a0ac61',
        'button.primary.borderColor.hover': '#a7b364',
        'button.primary.borderColor.active': '#858d55',
        'button.primary.borderColor.disabled': '#33312f',
        'button.primary.fgColor.disabled': '#baa37e',
        'button.primary.iconColor.disabled': '#baa37e',
        'focus.outlineColor': '#7caca1',
      },
      // Gruvbox marks the selected tab with its orange accent rather than
      // the shared accent, so this is an explicit component exception.
      components: {
        'underlineNav.borderColor.active': '#e78a4e',
      },
    },
  },
})
