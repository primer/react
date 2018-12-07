import styled from 'styled-components'
import PropTypes from 'prop-types'
import {TYPOGRAPHY, COMMON, Base} from './constants'
import theme from './theme'

const Heading = styled(Base)`
  ${TYPOGRAPHY} ${COMMON};
`

Heading.defaultProps = {
  theme,
  m: 0,
  fontSize: 5,
  is: 'h1'
}

Heading.propTypes = {
  ...COMMON.propTypes,
  ...TYPOGRAPHY.propTypes,
  is: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  theme: PropTypes.object
}

export default Heading
