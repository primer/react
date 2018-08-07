import {withSystemProps, FLEX_CONTAINER} from './system-props'

const FlexContainer = withSystemProps(
  {
    is: 'div',
    display: 'flex'
  },
  FLEX_CONTAINER
)

export default FlexContainer
