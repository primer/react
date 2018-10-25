import {withSystemProps, LAYOUT} from './system-props'

const BorderBox = withSystemProps(
  {
    is: 'div',
    bg: 'white',
    border: 1,
    borderColor: 'gray.2',
    borderRadius: 1
  },
  [...LAYOUT, 'boxShadow']
)

export default BorderBox
