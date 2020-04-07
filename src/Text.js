import styled from 'styled-components'
import PropTypes from 'prop-types'
import theme from './theme'
import {TYPOGRAPHY, COMMON} from './constants'
import {Platform} from './primitives'

const Text = styled.span`
  ${TYPOGRAPHY};
  ${COMMON};
`

Text.defaultProps = {
  theme,
  ...(Platform.OS !== 'web' && {fontSize: 14, fontFamily: 'Helvetica'}), // No font inherited on native platforms
}

Text.propTypes = {
  ...TYPOGRAPHY.propTypes,
  ...COMMON.propTypes,
  theme: PropTypes.object
}

export default Text
