import PropTypes from 'prop-types'
import styled from 'styled-components'
import {themeGet} from 'styled-system'
import theme from './theme'
import {COMMON} from './constants'

const BranchName = styled.a`
  display: inline-block;
  padding: 2px 6px;
  font-size: ${themeGet('fontSizes.0', theme.fontSizes[0])}px;
  font-family: ${themeGet('fonts.mono', theme.fonts.mono)};
  color: rgba(27, 31, 35, 0.6);
  background-color: #eaf5ff;
  border-radius: 3px;
  ${COMMON};
`

BranchName.defaultProps = {
  theme
}

BranchName.propTypes = {
  href: PropTypes.string,
  ...COMMON.propTypes
}

export default BranchName
