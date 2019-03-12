import styled from 'styled-components'
import PropTypes from 'prop-types'
import {TYPOGRAPHY, COMMON, get} from './constants'
import theme from './theme'

const Heading = styled.h1`
  font-weight: ${get('fontWeights.bold')};
  font-size: ${get('fontSizes.5')};
  ${TYPOGRAPHY} ${COMMON};
`

Heading.defaultProps = {
  theme,
  m: 0
}

Heading.propTypes = {
  ...COMMON.propTypes,
  ...TYPOGRAPHY.propTypes,
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  theme: PropTypes.object
}

export default Heading
