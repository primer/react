import styled from 'styled-components'
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
  theme:  PropTypes.object
}

export default Text
