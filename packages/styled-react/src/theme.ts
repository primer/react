import {fontStack, type KeyPaths} from './theme-utils'
import {colorSchemes} from './legacy-theme/ts/color-schemes'

const animation = {
  easeOutCubic: 'cubic-bezier(0.33, 1, 0.68, 1)',
}

const breakpoints = ['544px', '768px', '1012px', '1280px']

const fonts = {
  normal: fontStack([
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Noto Sans',
    'Helvetica',
    'Arial',
    'sans-serif',
    'Apple Color Emoji',
    'Segoe UI Emoji',
  ]),
  mono: `var(--fontStack-monospace, ${fontStack([
    'SFMono-Regular',
    'Consolas',
    'Liberation Mono',
    'Menlo',
    'Courier',
    'monospace',
  ])})`,
}

const lineHeights = {
  condensedUltra: 1,
  condensed: 1.25,
  default: 1.5,
}

const fontWeights = {
  light: 300,
  normal: 400,
  semibold: 500,
  bold: 600,
}

const borderWidths = [0, '1px']

const radii = ['0', '3px', '6px', '100px']

const sizes = {
  small: '544px',
  medium: '768px',
  large: '1012px',
  xlarge: '1280px',
}

const fontSizes = ['12px', '14px', '16px', '20px', '24px', '32px', '40px', '48px', '56px']

const space = ['0', '4px', '8px', '16px', '24px', '32px', '40px', '48px', '64px', '80px', '96px', '112px', '128px']

const theme = {
  animation,
  borderWidths,
  breakpoints,
  fonts,
  fontSizes,
  fontWeights,
  lineHeights,
  radii,
  sizes,
  space,
  colorSchemes,
}

export default theme

// NOTE: for now, ThemeColors and ThemeShadows are handcrafted types. It would be nice if these
// were exports from primitives (or a different shape but derived from those exports).

type ThemeColors = {
  fg: {
    default: string
    muted: string
    subtle: string
    onEmphasis: string
  }
  canvas: {
    default: string
    overlay: string
    inset: string
    subtle: string
  }
  border: {
    default: string
    muted: string
    subtle: string
  }

  // Roles
  neutral: {
    emphasisPlus: string
    emphasis: string
    muted: string
    subtle: string
  }
  accent: {
    fg: string
    emphasis: string
    muted: string
    subtle: string
  }
  success: {
    fg: string
    emphasis: string
    muted: string
    subtle: string
  }
  attention: {
    fg: string
    emphasis: string
    muted: string
    subtle: string
  }
  severe: {
    fg: string
    emphasis: string
    muted: string
    subtle: string
  }
  danger: {
    fg: string
    emphasis: string
    muted: string
    subtle: string
  }
  open: {
    fg: string
    emphasis: string
    muted: string
    subtle: string
  }
  closed: {
    fg: string
    emphasis: string
    muted: string
    subtle: string
  }
  done: {
    fg: string
    emphasis: string
    muted: string
    subtle: string
  }
  sponsors: {
    fg: string
    emphasis: string
    muted: string
    subtle: string
  }
}

type ThemeShadows = {
  shadow: {
    small: string
    medium: string
    large: string
    extraLarge: string
  }
}

export type ThemeColorPaths = KeyPaths<ThemeColors>
export type ThemeShadowPaths = KeyPaths<ThemeShadows>
