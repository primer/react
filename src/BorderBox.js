import Box from './Box'
import {withSystemProps, LAYOUT} from './system-props'

const BorderBox = withSystemProps(
  {
    is: 'div',
    bg: 'white',
    border: 1,
    borderColor: Box.defaultProps.borderColor,
    borderRadius: 1
  },
  LAYOUT
)

export default BorderBox
