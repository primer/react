import {withSystemProps, TYPOGRAPHY, COMMON} from './system-props'

const BaseStyles = withSystemProps(
  {
    is: 'div',
    color: 'gray.9',
    fontFamily: 'normal',
    lineHeight: 'default'
  },
  [...TYPOGRAPHY, ...COMMON]
)

export default BaseStyles
