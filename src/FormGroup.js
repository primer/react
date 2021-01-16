import PropTypes from 'prop-types'
import styled from 'styled-components'
import {COMMON, get, TYPOGRAPHY} from './constants'
import theme from './theme'
import sx from './sx'

const FormGroup = styled.div`
  margin: ${get('space.3')} 0;
  font-weight: ${get('fontWeights.normal')};
  ${COMMON};
  ${sx};
`

FormGroup.Label = styled.label`
  display: block;
  margin: 0 0 ${get('space.2')};
  font-size: ${get('fontSizes.1')};
  font-weight: ${get('fontWeights.bold')};
  ${TYPOGRAPHY};
  ${COMMON};
  ${sx};
`

FormGroup.Label.defaultProps = {
  theme
}
FormGroup.Label.propTypes = {
  ...TYPOGRAPHY.propTypes,
  ...COMMON.propTypes,
  ...sx.propTypes
}
FormGroup.Label.displayName = 'FormGroup.Label'

FormGroup.defaultProps = {theme}
FormGroup.propTypes = {
  children: PropTypes.node,
  ...COMMON.propTypes,
  ...sx.propTypes
}

export default FormGroup
