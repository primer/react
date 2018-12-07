import styled from 'styled-components'
import PropTypes from 'prop-types'
import theme from './theme'
import {TYPOGRAPHY, COMMON, Base} from './constants'

const Text = styled(Base)`
  ${TYPOGRAPHY} ${COMMON};
`

Text.defaultProps = {
  is: 'span',
  theme
}

Text.propTypes = {
  ...TYPOGRAPHY.propTypes,
  ...COMMON.propTypes,
  is: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  theme:  PropTypes.object
}

export default Text
