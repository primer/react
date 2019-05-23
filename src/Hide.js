import styled from 'styled-components'
import Box from './Box'

const Hide = styled(Box)``

Hide.defaultProps = {
  display: 'none'
}
Hide.propTypes = {
  ...Box.propTypes
}

export default Hide
