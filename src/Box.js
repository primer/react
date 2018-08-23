import {withSystemProps, LAYOUT} from './system-props'

const Box = withSystemProps(
  {
    is: 'div',
    border: 0,
    borderColor: 'gray.2'
  },
  LAYOUT
)

export default Box
