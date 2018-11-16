import {withSystemProps, FLEX_CONTAINER, COMMON, FLEX_ITEM} from './system-props'

const Flex = withSystemProps(
  {
    is: 'div',
    display: 'flex'
  },
  [...FLEX_CONTAINER, ...COMMON]
)

Flex.Item = withSystemProps('div', [...FLEX_ITEM, ...COMMON])

export default Flex
