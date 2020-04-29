import PropTypes from 'prop-types'
import styled from 'styled-components'
import sx from './sx'
import theme from './theme'
import {COMMON, get} from './constants'

const BranchName = styled.a`
  display: inline-block;
  padding: 2px 6px;
  font-size: ${get('fontSizes.0')};
  font-family: ${get('fonts.mono')};
  color: rgba(27, 31, 35, 0.6);
  background-color: #eaf5ff;
  border-radius: 3px;
  ${COMMON};
  ${sx};
`

BranchName.defaultProps = {
  theme
}

BranchName.propTypes = {
  href: PropTypes.string,
  ...COMMON.propTypes,
  ...sx.propTypes,
  theme: PropTypes.object
}

export default BranchName
