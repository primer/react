import styled from 'styled-components'
import PropTypes from 'prop-types'
import {display} from 'styled-system'
import {COMMON, FLEX_CONTAINER, FLEX_ITEM} from './constants'
import theme from './theme'
import Box from './Box'

const Flex = styled(Box)`
  ${FLEX_CONTAINER}
`

Flex.Item = styled(Box)`
  ${FLEX_ITEM}
`

Flex.defaultProps = {
  theme,
  display: 'flex'
}
Flex.Item.defaultProps = {
  theme
}
Flex.propTypes = {
  ...Box.propTypes,
  ...FLEX_CONTAINER.propTypes,
}

Flex.Item.propTypes = {
  ...FLEX_ITEM.propTypes,
  theme: PropTypes.object
}

export default Flex
