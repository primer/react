import styled from 'styled-components'
import PropTypes from 'prop-types'
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
  display: 'flex',
  is: 'div'
}
Flex.Item.defaultProps = {
  theme,
  is: 'div'
}
Flex.propTypes = {
  ...COMMON.propTypes,
  ...FLEX_CONTAINER.propTypes,
  is: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
}

Flex.Item.propTypes = {
  ...COMMON.propTypes,
  ...FLEX_ITEM.propTypes,
  is: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  theme: PropTypes.object
}

export default Flex
