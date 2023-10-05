import colors from './colors'

interface Theme {
  colors: typeof colors
}

const theme: Theme = {
  colors,
}

export default theme
