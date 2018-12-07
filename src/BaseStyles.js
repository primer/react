import styled from 'styled-components'
import PropTypes from 'prop-types'
import {TYPOGRAPHY, COMMON} from './constants'
import theme from './theme'

const BaseStyles = styled.div`
  ${TYPOGRAPHY} ${COMMON};
`

BaseStyles.defaultProps = {
  color: 'gray.9',
  fontFamily: 'normal',
  lineHeight: 'default',
  theme
}

BaseStyles.propTypes = {
  ...TYPOGRAPHY.propTypes,
  ...COMMON.propTypes,
  theme: PropTypes.object
}
export default BaseStyles
