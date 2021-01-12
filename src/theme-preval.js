// @preval

const {colors: colorPrimitives, typography} = require('@primer/primitives')
const {lighten, rgba, desaturate} = require('polished')

const {lineHeights} = typography
const {black, white, pink, gray, blue, green, orange, purple, red, yellow} = colorPrimitives
// General
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
  pink,
  blackfade15: 'rgba(27, 31, 35, 0.15)',
  blackfade20: 'rgba(27, 31, 35, 0.20)',
  blackfade30: 'rgba(27,31,35,0.3)',
  blackfade35: 'rgba(27, 31, 35, 0.35)',
  blackfade50: 'rgba(27, 31, 35, 0.5)',
  whitefade15: 'rgba(255, 255, 255, 0.15)',
  whitefade50: 'rgba(255, 255, 255, 0.50)',
  whitefade70: 'rgba(255, 255, 255, 0.70)',
  state: {
    error: red[5],
    failure: red[5],
    pending: yellow[7],
    queued: yellow[7],
    success: green[5],
    unknown: gray[4],
  },

  border: {
    blackFade: rgba(black, 0.15),
    blue: blue[5],
    blueLight: blue[2],
    grayLight: lighten(0.03, gray[2]),
    gray: gray[2],
    grayDark: gray[3],
    grayDarker: gray[7],
    green: green[4],
    greenLight: desaturate(0.4, green[3]),
    purple: purple[5],
    red: red[5],
    redLight: desaturate(0.6, red[3]),
    white,
    whiteFade: rgba(white, 0.15),
    yellow: desaturate(0.6, yellow[3]),
  },
  counter: {
    bg: 'rgba(27, 31, 35, 0.08)',
  },
  filterList: {
    hoverBg: '#eaecef',
  },
  text: {
    white,
    gray: gray[6],
    grayLight: gray[5],
    grayDark: gray[9],
    red: red[6],
  },
  bg: {
    gray: gray[1],
    grayLight: gray[0],
    grayDark: gray[9],
    disabled: '#F3F4F6',
  },
  accent: orange[5],
  labels: {
    gray: gray[2],
    grayText: gray[9],
    grayDark: gray[5],
    grayDarkText: gray[9],
    blue: blue[5],
    blueText: blue[5],
    orange: orange[5],
    orangeText: orange[6],
    green: green[5],
    greenText: green[6],
    red: red[6],
    redText: red[6],
    yellow: yellow[6],
    yellowText: yellow[9],
    pink: pink[4],
    pinkText: pink[6],
    purple: purple[4],
    purpleText: [5],
  },
}

const breakpoints = ['544px', '768px', '1012px', '1280px']

const fonts = {
  normal: fontStack([
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Helvetica',
    'Arial',
    'sans-serif',
    'Apple Color Emoji',
    'Segoe UI Emoji',
  ]),
  mono: fontStack(['SFMono-Regular', 'Consolas', 'Liberation Mono', 'Menlo', 'Courier', 'monospace']),
}

const fontWeights = {
  light: 300,
  normal: 400,
  semibold: 500,
  bold: 600,
}

const borderWidths = [0, '1px']

const radii = ['0', '3px', '6px', '100px']

const shadows = {
  small: '0 1px 0 rgba(149, 157, 165, 0.1)',
  medium: '0 3px 6px rgba(149, 157, 165, 0.15)',
  large: '0 8px 24px rgba(149, 157, 165, 0.2)',
  'extra-large': '0 12px 48px rgba(149, 157, 165, 0.3)',
  formControl: 'inset 0px 2px 0px rgba(225, 228, 232, 0.2)',
  formControlDisabled: 'inset 0px 2px 0px rgba(220, 227, 237, 0.3)',
  formControlFocus: 'rgba(3, 102, 214, 0.3) 0px 0px 0px 0.2em',
  primaryShadow: '0px 1px 0px rgba(20, 70, 32, 0.1), inset 0px 2px 0px rgba(255, 255, 255, 0.03)',
  primaryActiveShadow: 'inset 0px 1px 0px rgba(20, 70, 32, 0.2)',
}

const sizes = {
  small: '544px',
  medium: '768px',
  large: '1012px',
  xlarge: '1280px',
}

const fontSizes = ['12px', '14px', '16px', '20px', '24px', '32px', '40px', '48px']

const space = ['0', '4px', '8px', '16px', '24px', '32px', '40px', '48px', '64px', '80px', '96px', '112px', '128px']

// Components

const buttons = {
  default: {
    color: {
      default: colors.text.grayDark,
      disabled: gray[4],
    },
    border: {
      default: 'rgba(27, 31, 35, 0.12)',
      active: colors.border.grayDark,
      disabled: colors.border.grayLight,
    },
    bg: {
      default: colors.bg.grayLight,
      hover: '#F3F4F6', // custom gray
      active: '#edeff2', //custom gray
      disabled: colors.bg.grayLight,
    },
    shadow: {
      default: '0px 1px 0px rgba(27, 31, 35, 0.04), inset 0px 2px 0px rgba(255, 255, 255, 0.25)',
      hover: '0px 1px 0px rgba(209, 213, 218, 0.2), inset 0px 2px 0px rgba(255, 255, 255, 0.1)',
      active: 'inset 0px 2px 0px rgba(149, 157, 165, 0.1)',
      focus: '0 0 0 3px rgba(3, 102, 214, 0.3)',
    },
  },
  primary: {
    color: {
      default: white,
      disabled: colors.whitefade50,
    },
    border: {
      default: green[6],
      hover: 'rgba(27, 31, 35, 0.15)',
      active: 'rgba(27, 31, 35, 0.15)',
      disabled: 'rgba(34, 134, 58, 0.1)',
    },
    bg: {
      default: '#2EA44F', //custom green
      focus: '#2C974B', //custom green
      hover: '#2C974B', //custom green
      active: '#128031', // 2% darker than hover bg
      disabled: '#94D3A2', // custom gray
    },
    shadow: {
      default: ' 0px 1px 0px rgba(20, 70, 32, 0.1), inset 0px 2px 0px rgba(255, 255, 255, 0.03)',
      active: '0px 1px 0px rgba(27, 31, 35, 0.1), inset 0px 2px 0px rgba(255, 255, 255, 0.03)',
      hover: '0px 1px 0px rgba(27, 31, 35, 0.1), inset 0px 2px 0px rgba(255, 255, 255, 0.03)',
      focus: '0 0 0 3px #94D3A2',
    },
  },
  danger: {
    color: {
      default: colors.text.red,
      hover: white,
      active: white,
      disabled: 'rgba(203,36,49, .5)', // custom?
    },
    border: {
      default: colors.border.gray,
      hover: 'rgba(27, 31, 35, 0.15)',
      active: 'rgba(27, 31, 35, 0.15)',
    },
    bg: {
      default: gray[0],
      hover: red[6],
      active: '#be222e', // 2% darker than hover bg
      disabled: '#F3F4F6',
    },
    shadow: {
      default: '0px 1px 0px rgba(149, 157, 165, 0.1), inset 0px 2px 0px rgba(255, 255, 255, 0.25)',
      active: '0px 1px 0px rgba(27, 31, 35, 0.1), inset 0px 2px 0px rgba(255, 255, 255, 0.03)',
      hover: '0px 1px 0px rgba(27, 31, 35, 0.1), inset 0px 2px 0px rgba(255, 255, 255, 0.03)',
      focus: '0 0 0 3px rgba(203, 36, 49, 0.4)',
    },
  },
  outline: {
    color: {
      default: blue[5],
      hover: white,
      active: white,
      disabled: gray[4],
    },
    border: {
      default: gray[2], //border-gray
      hover: 'rgba(27, 31, 35, 0.15)',
      active: 'rgba(27, 31, 35, 0.15)',
    },
    bg: {
      default: gray[0],
      hover: blue[5],
      active: '#035fc7', // 2% darker than hover bg
      disabled: '#F3F4F6',
    },
    shadow: {
      default: '0px 1px 0px rgba(149, 157, 165, 0.1), inset 0px 2px 0px rgba(255, 255, 255, 0.25)',
      active: '0px 1px 0px rgba(27, 31, 35, 0.1), inset 0px 2px 0px rgba(255, 255, 255, 0.03)',
      hover: '0px 1px 0px rgba(27, 31, 35, 0.1), inset 0px 2px 0px rgba(255, 255, 255, 0.03)',
      focus: '0 0 0 3px rgba(3, 102, 214, 0.3)',
    },
  },
  close: {
    color: {
      default: colors.text.grayDark,
    },
    shadow: {
      focus: '0 0 0 3px rgba(3, 102, 214, 0.3)',
    },
  },
}

const flash = {
  default: {
    backgroundColor: blue[1],
    borderColor: 'rgba(4, 66, 137, 0.2)',
  },
  success: {
    backgroundColor: green[1],
    borderColor: 'rgba(23, 111, 44, 0.2)',
  },
  danger: {
    backgroundColor: '#FFE3E6',
    borderColor: 'rgba(158, 28, 35, 0.2)',
  },
  warning: {
    backgroundColor: yellow[1],
    borderColor: 'rgba(176, 136, 0, 0.2)',
  },
}

// this has to be separated from the flash object since we have to use an svg selector to style the icon color
const flashIcon = {
  default: 'rgba(4, 66, 137, 0.6)',
  success: 'rgba(23, 111, 44, 0.8)',
  danger: 'rgba(158, 28, 35, 0.6)',
  warning: yellow[8],
}

const popovers = {
  colors: {
    caret: 'rgba(27, 31, 35, 0.15)',
  },
}

const pagination = {
  borderRadius: radii[2],
  spaceBetween: space[1],
  colors: {
    normal: {
      fg: colors.gray[9],
    },
    disabled: {
      fg: colors.gray[3],
      border: 'transparent',
    },
    hover: {
      border: colors.border.grayLight,
    },
    selected: {
      fg: colors.white,
      bg: colors.blue[5],
      border: 'transparent',
    },
    active: {
      border: colors.border.grayLight,
    },
    nextPrevious: {
      fg: colors.blue[5],
    },
  },
}

const stateLabels = {
  sizes: {
    small: {
      padding: `${space[1]} ${space[2]}`,
      fontSize: fontSizes[0],
    },
    normal: {
      padding: `${space[2]} 12px`,
      fontSize: fontSizes[1],
    },
  },

  status: {
    issueClosed: {
      backgroundColor: red[5],
    },
    pullClosed: {
      backgroundColor: red[5],
    },
    pullMerged: {
      backgroundColor: purple[5],
    },
    issueOpened: {
      backgroundColor: '#159739', // custom green
    },
    pullOpened: {
      backgroundColor: '#159739', // custom green
    },
    draft: {
      backgroundColor: gray[5],
    },
  },
}

const theme = {
  // General
  borderWidths,
  breakpoints,
  colors,
  fonts,
  fontSizes,
  fontWeights,
  lineHeights,
  radii,
  shadows,
  sizes,
  space,

  // Components
  buttons,
  pagination,
  popovers,
  flash,
  flashIcon,
  stateLabels,
}

module.exports = {
  theme,
  colors,
}

function fontStack(fonts) {
  return fonts.map((font) => (font.includes(' ') ? `"${font}"` : font)).join(', ')
}
