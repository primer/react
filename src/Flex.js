import styled from 'styled-components'
import PropTypes from 'prop-types'
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
  ...Box.propTypes
}

Flex.Item.propTypes = {
  ...Box.propTypes,
  theme: PropTypes.object
}

export default Flex
