import styled from 'styled-components'
import {display} from 'styled-system'
import theme from './theme'
import {FLEX_CONTAINER, FLEX_ITEM, COMMON} from './constants'

const Flex = styled.div`
  ${FLEX_CONTAINER}
  ${COMMON}
  ${display}
`

Flex.defaultProps = {
  display: 'flex',
  theme
}

const FlexItem = styled.div`
  ${FLEX_ITEM} ${COMMON};
`
Flex.Item = FlexItem

export default Flex
