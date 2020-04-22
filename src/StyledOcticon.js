import PropTypes from 'prop-types'
import styled from 'styled-components'
import {COMMON} from './constants'
import theme from './theme'

const StyledOcticon = styled.span(COMMON)

StyledOcticon.defaultProps = {
  theme
}

StyledOcticon.propTypes = {
  ...COMMON.propTypes,
  theme: PropTypes.object
}

export default StyledOcticon
