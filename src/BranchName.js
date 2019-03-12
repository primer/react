import PropTypes from 'prop-types'
import styled from 'styled-components'
import theme from './theme'
import {COMMON, get} from './constants'

const BranchName = styled.div`
  display: inline-block;
  padding: 2px 6px;
  font-size: ${get('fontSizes.0')}px;
  font-family: ${get('fonts.mono')};
  color: rgba(27, 31, 35, 0.6);
  background-color: #eaf5ff;
  border-radius: 3px;
  ${COMMON};
`

BranchName.defaultProps = {
  theme,
  as: 'a'
}

BranchName.propTypes = {
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  href: PropTypes.string,
  ...COMMON.propTypes,
  theme: PropTypes.object
}

export default BranchName
