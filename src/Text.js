import styled from 'styled-components'
import PropTypes from 'prop-types'
import theme from './theme'
import {TYPOGRAPHY, COMMON} from './constants'
import sx from './sx'

const Text = styled.span`
  ${TYPOGRAPHY};
  ${COMMON};
  ${sx};
`

Text.defaultProps = {
  theme,
}

Text.propTypes = {
  ...TYPOGRAPHY.propTypes,
  ...COMMON.propTypes,
  ...sx.propTypes,
  theme: PropTypes.object,
}

export default Text
