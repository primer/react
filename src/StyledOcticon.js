import Octicon from '@primer/octicons-react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {COMMON} from './constants'
import theme from './theme'
import sx, {propTypes as sxPropTypes} from './sx'

const StyledOcticon = styled(Octicon)`
  ${COMMON};
  ${sx};
`

StyledOcticon.defaultProps = {
  theme
}

StyledOcticon.propTypes = {
  ...COMMON.propTypes,
  ...sxPropTypes,
  theme: PropTypes.object
}

export default StyledOcticon
