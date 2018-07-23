const colors = {
  bodytext: '#24292e',
  black: '#1b1f23',
  white: '#fff',
  gray: ['#fafbfc', '#f6f8fa', '#e1e4e8', '#d1d5da', '#959da5', '#6a737d', '#586069', '#444d56', '#2f363d', '#24292e'],
  blue: ['#f1f8ff', '#dbedff', '#c8e1ff', '#79b8ff', '#2188ff', '#0366d6', '#005cc5', '#044289', '#032f62', '#05264c'],
  green: ['#f0fff4', '#dcffe4', '#bef5cb', '#85e89d', '#34d058', '#28a745', '#22863a', '#176f2c', '#165c26', '#144620'],
  yellow: [
    '#fffdef',
    '#fffbdd',
    '#fff5b1',
    '#ffea7f',
    '#ffdf5d',
    '#ffd33d',
    '#f9c513',
    '#dbab09',
    '#b08800',
    '#735c0f'
  ],
  orange: [
    '#fff8f2',
    '#ffebda',
    '#ffd1ac',
    '#ffab70',
    '#fb8532',
    '#f66a0a',
    '#e36209',
    '#d15704',
    '#c24e00',
    '#a04100'
  ],
  red: ['#ffeef0', '#ffdce0', '#fdaeb7', '#f97583', '#ea4a5a', '#d73a49', '#cb2431', '#b31d28', '#9e1c23', '#86181d'],
  purple: [
    '#f5f0ff',
    '#e6dcfd',
    '#d1bcf9',
    '#b392f0',
    '#8a63d2',
    '#6f42c1',
    '#5a32a3',
    '#4c2889',
    '#3a1d6e',
    '#29134e'
  ],
  blackfade15: 'rgba(27, 31 ,35, 0.15)',
  blackfade20: 'rgba(27, 31 ,35, 0.20)',
  whitefade15: 'rgba(255, 255 ,255, 0.15)'
}

const {blue, gray, green, purple, red, yellow} = colors

colors.border = {
  'black-fade': colors.blackfade15,
  blue: blue[5],
  'blue-light': blue[2],
  green: green[4],
  'green-light': green[3], // FIXME desaturate($green-300, 40%)
  red: red[5],
  'red-light': red[3], // FIXME desaturate($red-300, 60%)
  purple: purple[5],
  yellow: '#d9d0a5', // desaturate($yellow-300, 60%)
  gray: gray[2],
  'gray-light': gray[2], // FIXME lighten($gray-200, 3%)
  'gray-dark': gray[3],
  'gray-darker': gray[7]
}

colors.bg = {
  white: colors.white,
  'gray-light': gray[0],
  gray: gray[1],
  'gray-dark': gray[9],
  purple: purple[5],
  blue: blue[5],
  green: green[5],
  yellow: yellow[5],
  // orange: orange[7],
  red: red[5],
  'purple-light': purple[0],
  'blue-light': blue[0],
  'green-light': green[1],
  'yellow-light': yellow[2],
  'red-light': red[1]
}

const theme = {
  breakpoints: ['544px', '768px', '1012px', '1280px'],
  maxWidths: {
    small: '544px',
    medium: '768px',
    large: '1012px',
    xlarge: '1280px'
  },
  fonts: [
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Helvetica',
    'Arial',
    'sans-serif',
    'Apple Color Emoji',
    'Segoe UI Emoji',
    'Segoe UI Symbol'
  ],
  lineHeight: 1.5,
  colors,
  radii: [0, 3, 6],
  space: [0, 4, 8, 16, 24, 32, 40, 48],
  fontSizes: [12, 14, 16, 20, 24, 32, 40, 48]
}

module.exports = theme
