import styled from 'styled-components'
import theme from './theme'
import Box from './Box'

const Flex = styled(Box)``

Flex.defaultProps = {
  theme,
  display: 'flex'
}

Flex.propTypes = {
  ...Box.propTypes
}

export default Flex
