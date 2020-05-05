import Octicon from '@primer/octicons-react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {COMMON} from './constants'
import theme from './theme'
import sx from './sx'

const StyledOcticon = styled(Octicon)`
  ${COMMON};
  ${sx};
`

StyledOcticon.defaultProps = {
  theme
}

StyledOcticon.propTypes = {
  ...COMMON.propTypes,
  ...sx.propTypes,
  theme: PropTypes.object
}

export default StyledOcticon
