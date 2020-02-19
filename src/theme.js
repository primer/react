import {black, white, gray, blue, green, orange, purple, red, yellow} from 'primer-colors'
import {lineHeights} from 'primer-typography'

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
  whitefade50: 'rgba(255, 255, 255, 0.50)',
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
  counter: {
    bg: 'rgba(27, 31, 35, 0.08)'
  },
  filterList: {
    hoverBg: '#eaecef'
  },
  text: {
    gray: gray[6],
    grayLight: gray[5],
    grayDark: gray[9],
    red: red[6]
  },
  bg: {
    gray: gray[1],
    grayLight: gray[0]
  }	
}

const buttons = {
  default: {
    color: {
      default: colors.text.grayDark,
      disabled: gray[4]
    },
    border: {
      default: colors.border.gray,
      focus: colors.blackfade10, 
      active: colors.border.grayDark, 
      disabled: colors.border.grayLight,
    },
    bg: {
      default: colors.bg.grayLight,
      active: '#F3F4F6', //custom gray
    },
    shadow: {
      default: '0px 1px 0px rgba(149, 157, 165, 0.1), inset 0px 2px 0px rgba(255, 255, 255, 0.25)',
      hover: '0px 1px 0px rgba(209, 213, 218, 0.2), inset 0px 2px 0px rgba(255, 255, 255, 0.1)',
      active: 'inset 0px 2px 0px rgba(149, 157, 165, 0.1)',
    }
  },
  primary: {
    color: {
      default: white,
      disabled: colors.whitefade50
    },
    border: {
      default: green[6],
      focus: '#94D3A2', //custom green
      hover: green[7],
      disabled: 'rgba(34, 134, 58, 0.1)'
    },
    bg: {
      default: '#159739', //custom green
      focus: '#138934', //custom green
      hover: '#138934', //custom green
      active: '#138934', //custom green
      disabled: '#94D3A2' // custom
    },
    shadow: {
      default: ' 0px 1px 0px rgba(20, 70, 32, 0.1), inset 0px 2px 0px rgba(255, 255, 255, 0.03)',
      active: 'inset 0px 1px 0px rgba(20, 70, 32, 0.2)'
    }
  },
  danger: {
    color: {
      default: colors.text.red,
      hover: white,
      active: white,
      disabled: 'rgba(203,36,49, .5)' // custom?
    },
    border: {
      default: colors.border.gray,
      focus: 'rgba(203, 36, 49, 0.4)',
      hover: red[7],
      active: red[7],
    },
    bg: {
      default: gray[0],
      hover: red[6],
      active: red[6],
      disabled: '#F3F4F6'
    },
    shadow: {
      default: '0px 1px 0px rgba(149, 157, 165, 0.1), inset 0px 2px 0px rgba(255, 255, 255, 0.25)',
      hover: '0px 1px 0px rgba(149, 157, 165, 0.1), inset 0px 2px 0px rgba(255, 255, 255, 0.03)',
      active: 'inset 0px 2px 0px rgba(179, 29, 40, 0.4)',
    }
  },
  outline: {
    color: {
      default: blue[6],
      hover: white,
      active: white,
      disabled: gray[4]
    },
    border: {
      default: gray[2], //border-gray
      focus: 'rgba(3, 102, 214, 0.3)',
      hover: blue[6],
      active: blue[6],
    },
    bg: {
      default: gray[0],
      hover: blue[5],
      active: blue[5],
      disabled: '#F3F4F6'
    },
    shadow: {
      default: '0px 1px 0px rgba(149, 157, 165, 0.1), inset 0px 2px 0px rgba(255, 255, 255, 0.25)',
      hover: '0px 1px 0px rgba(149, 157, 165, 0.1), inset 0px 2px 0px rgba(255, 255, 255, 0.03)',
      active: 'inset 0px 1px 0px rgba(4, 66, 137, 0.2)',
    }
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
  space: ['0', '4px', '8px', '16px', '24px', '32px', '40px', '48px', '64px', '80px', '96px', '112px', '128px'],
  buttons,
}

export default theme
export {colors}

function fontStack(fonts) {
  return fonts.map(font => (font.includes(' ') ? `"${font}"` : font)).join(', ')
}
