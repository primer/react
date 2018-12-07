import styled from 'styled-components'
import {display} from 'styled-system'
import {COMMON, FLEX_CONTAINER, FLEX_ITEM, Base} from './constants'
import theme from './theme'

const Flex = styled(Base)`
  ${FLEX_CONTAINER}
  ${COMMON}
  ${display}
`

Flex.Item = styled(Base)`
  ${FLEX_ITEM} ${COMMON};
`

Flex.defaultProps = {
  theme,
  display: 'flex'
}
Flex.Item.defaultProps = {theme}
Flex.propTypes = {
  ...COMMON.propTypes,
  ...FLEX_CONTAINER.propTypes
}

Flex.Item.propTypes = {
  ...COMMON.propTypes,
  ...FLEX_ITEM.propTypes
}

export default Flex
