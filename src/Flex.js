import styled from 'styled-components'
import PropTypes from 'prop-types'
import {FLEX} from './constants'
import theme from './theme'
import Box from './Box'

const Flex = styled(Box)``

// Keeping this around for backwards compatibility, but it's the same as `FLEX`
Flex.Item = styled(Box)``

Flex.defaultProps = {
  theme,
  display: 'flex'
}
Flex.Item.defaultProps = {
  theme
}
Flex.propTypes = {
  ...Box.propTypes,
  ...FLEX.propTypes
}

Flex.Item.propTypes = {
  ...FLEX.propTypes,
  theme: PropTypes.object
}

export default Flex
