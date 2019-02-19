import styled from 'styled-components'
import PropTypes from 'prop-types'
import {TYPOGRAPHY, COMMON, Base, get} from './constants'
import theme from './theme'

const Heading = styled(Base)`
  font-weight: ${get('fontWeights.bold')};
  font-size: ${get('fontSizes.5')};
  ${TYPOGRAPHY} ${COMMON};
`

Heading.defaultProps = {
  theme,
  m: 0,
  is: 'h1'
}

Heading.propTypes = {
  ...COMMON.propTypes,
  ...TYPOGRAPHY.propTypes,
  is: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  theme: PropTypes.object
}

export default Heading
