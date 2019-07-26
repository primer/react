import styled from 'styled-components'
import PropTypes from 'prop-types'
import theme from './theme'
import {TYPOGRAPHY, COMMON} from './constants'

const Text = styled.span`
  ${TYPOGRAPHY};
  ${COMMON};
`

Text.defaultProps = {
  theme
}

Text.propTypes = {
  ...TYPOGRAPHY.propTypes,
  ...COMMON.propTypes,
  theme: PropTypes.object
}

export default Text
