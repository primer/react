import {withSystemProps, LAYOUT} from './system-props'

const Box = withSystemProps(
  {
    is: 'div',
    bg: 'white',
    border: 1,
    borderColor: 'gray.2',
    borderRadius: 1
  },
  LAYOUT
)

export default Box