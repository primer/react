import {withSystemProps, FLEX_CONTAINER, FLEX_ITEM} from './system-props'

const Flex = withSystemProps(
  {
    is: 'div',
    display: 'flex'
  },
  FLEX_CONTAINER
)

Flex.Item = withSystemProps('div', FLEX_ITEM)

export default Flex
