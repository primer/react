import PropTypes from 'prop-types'
import styled from 'styled-components'
import {COMMON, get, TYPOGRAPHY, SystemCommonProps, SystemTypographyProps} from './constants'
import theme from './theme'
import sx, {SxProp} from './sx'

const FormGroup = styled.div<SystemCommonProps & SxProp>`
  margin: ${get('space.3')} 0;
  font-weight: ${get('fontWeights.normal')};
  ${COMMON};
  ${sx};
`

FormGroup.defaultProps = {theme}

FormGroup.propTypes = {
  children: PropTypes.node,
  ...COMMON.propTypes,
  ...sx.propTypes
}

FormGroup.Label = styled.label<SystemTypographyProps & SystemCommonProps & SxProp>`
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

export default FormGroup
