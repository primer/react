import {black, white, gray, blue, green, orange, purple, red, yellow} from 'primer-colors'
import {lineHeights} from 'primer-typography'
import { textAlign } from 'styled-system'

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
  blackfade30: 'rgba(27,31,35,0.3)',
  blackfade35: 'rgba(27, 31, 35, 0.35)',
  blackfade50: 'rgba(27, 31, 35, 0.5)',
  whitefade15: 'rgba(255, 255, 255, 0.15)',
  state: {
    error: red[5],
    failure: red[5],
    pending: yellow[7],
    queued: yellow[7],
    success: green[5],
    unknown: gray[4]
  },
  border: {
    grayLight: '#eaecef',
    gray: gray[2],
    grayDark: '#d1d5da'
  },
  button: {
    bg: gray[0],
    selectedBg: '#F3F4F6',
    activeBg: 'rgb(233, 236, 239)',
    shadow: '0px 1px 0px rgba(149, 157, 165, 0.1), inset 0px 2px 0px rgba(255, 255, 255, 0.25)',
    hoverShadow: '0px 1px 0px rgba(209, 213, 218, 0.2), inset 0px 2px 0px rgba(255, 255, 255, 0.1)',
    focusShadow: '0px 1px 0px rgba(149, 157, 165, 0.1), inset 0px 2px 0px rgba(255, 255, 255, 0.25)',
    activeShadow: 'inset 0px 2px 0px rgba(149, 157, 165, 0.1)',
    hoverBorder: '1px solid rgba(27, 31, 35, 0.1)',
    activeBorder: '#D1D5DA', //border-gray-dark
    focusBorder: '3px solid rgba(3, 102, 214, 0.3)',
    disabledColor: gray[4],
    dangerActiveBg: 'rgb(181, 32, 44)',
    dangerFocusShadow: 'rgba(203, 36, 49, 0.4)',
    dangerHoverBgImage: 'rgb(222, 68, 80)',
    dangerDisabledColor: 'rgba(203,36,49,0.4)',
    white: 'rgb(255, 255, 255)',
    outlineBlue: 'rgb(3, 102, 214)',
    outlineShadow: 'rgba(3, 102, 214, 0.4)',
    primaryBg: '#159739',
    primaryFocusBg: '#138934',
    primaryHoverBg: '#138934',
    primaryActiveBg: '#138934',
    primaryDisabledBg: '#94D3A2',
    primaryBorder: '#22863A',
    primaryHoverBorder: '#22863A',
    primaryDisabledBorder: 'rgba(34, 134, 58, 0.1)',
    primaryDisabledColor: 'rgba(255, 255, 255, .50)',
    primaryFocusOutline: '#94D3A2',
  },
  counter: {
    bg: 'rgba(27, 31, 35, 0.08)'
  },
  filterList: {
    hoverBg: '#eaecef'
  },
  text: {
    gray: gray[6],
    grayLight: gray[5],
    grayDark: gray[9]
  },
  bg: {
    gray: gray[1],
    grayLight: gray[0]
  }	
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
  fontWeights: {
    light: 300,
    normal: 400,
    bold: 600
  },
  colors,
  borders: [0, '1px solid'],
  fontSizes: ['12px', '14px', '16px', '20px', '24px', '32px', '40px', '48px'],
  lineHeights,
  radii: ['0', '3px', '6px'],
  shadows: {
    small: '0 1px 1px rgba(27, 31, 35, 0.1)',
    medium: '0 1px 5px rgba(27, 31, 35, 0.15)',
    large: '0 1px 15px rgba(27, 31, 35, 0.15)',
    'extra-large': '0 10px 50px rgba(27, 31, 35, 0.07)',
    formControl: 'rgba(27, 31, 35, 0.075) 0px 1px 2px inset',
    formControlFocus: 'rgba(3, 102, 214, 0.3) 0px 0px 0px 0.2em',
    primaryShadow: '0px 1px 0px rgba(20, 70, 32, 0.1), inset 0px 2px 0px rgba(255, 255, 255, 0.03)',
    primaryActiveShadow: 'inset 0px 1px 0px rgba(20, 70, 32, 0.2)',
  },
  space: ['0', '4px', '8px', '16px', '24px', '32px', '40px', '48px', '64px', '80px', '96px', '112px', '128px']
}

export default theme
export {colors}

function fontStack(fonts) {
  return fonts.map(font => (font.includes(' ') ? `"${font}"` : font)).join(', ')
}
