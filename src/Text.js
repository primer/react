import styled from 'styled-components'
import PropTypes from 'prop-types'
import {system} from 'styled-system'
import theme from './theme'
import {TYPOGRAPHY, COMMON} from './constants'

const whiteSpace = system({
  whiteSpace: {
    property: 'whiteSpace',
    cssProperty: 'whiteSpace'
  }
})

const Text = styled.span`
  ${TYPOGRAPHY};
  ${COMMON};
  ${whiteSpace};
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
