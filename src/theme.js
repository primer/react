import {
  black,
  white,
  gray,
  blue,
  green,
  orange,
  purple,
  yellow
} from 'primer-colors'
import {fontSizes, lineHeights} from 'primer-typography'

const colors = {
  bodytext: gray[9],
  black,
  white,
  gray,
  blue,
  green,
  orange,
  purple,
  red,
  yellow,
  blackfade15: 'rgba(27, 31, 35, 0.15)',
  blackfade20: 'rgba(27, 31, 35, 0.20)',
  whitefade15: 'rgba(255, 255, 255, 0.15)'
}

const theme = {
  breakpoints: ['544px', '768px', '1012px', '1280px'],
  maxWidths: {
    small: '544px',
    medium: '768px',
    large: '1012px',
    xlarge: '1280px'
  },
  fonts: {
    normal: fontStack([
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Helvetica',
      'Arial',
      'sans-serif',
      'Apple Color Emoji',
      'Segoe UI Emoji',
      'Segoe UI Symbol'
    ]),
    mono: fontStack(['SFMono-Regular', 'Consolas', 'Liberation Mono', 'Menlo', 'Courier', 'monospace'])
  },
  colors,
  borders: [0, '1px solid'],
  fontSizes,
  lineHeights,
  radii: [0, 3, 6],
  shadows: {
    small: '0 1px 1px rgba(27, 31, 35, 0.1)',
    medium: '0 1px 5px rgba(27, 31, 35, 0.15)',
    large: '0 1px 15px rgba(27, 31, 35, 0.15)',
    'extra-large': '0 10px 50px rgba(27, 31, 35, 0.07)'
  },
  space: [0, 4, 8, 16, 24, 32, 40, 48]
}

export default theme
export {colors}

function fontStack(fonts) {
  return fonts.map(font => (font.includes(' ') ? `"${font}"` : font)).join(', ')
}
