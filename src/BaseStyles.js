import {withSystemProps, TYPOGRAPHY} from './system-props'

const BaseStyles = withSystemProps(
  {
    is: 'div',
    color: 'gray.9',
    fontFamily: 'normal',
    lineHeight: 'default'
  },
  TYPOGRAPHY
)

export default BaseStyles
