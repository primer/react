import PropTypes from 'prop-types'
import styled from 'styled-components'
import {COMMON, get, TYPOGRAPHY, SystemCommonProps, SystemTypographyProps} from './constants'
import theme from './theme'
import sx, {SxProp} from './sx'
import {ComponentProps} from './utils/types'

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

const Label = styled.label<SystemTypographyProps & SystemCommonProps & SxProp>`
  display: block;
  margin: 0 0 ${get('space.2')};
  font-size: ${get('fontSizes.1')};
  font-weight: ${get('fontWeights.bold')};
  ${TYPOGRAPHY};
  ${COMMON};
  ${sx};
`

Label.displayName = 'FormGroup.Label'

Label.defaultProps = {
  theme
}

Label.propTypes = {
  ...TYPOGRAPHY.propTypes,
  ...COMMON.propTypes,
  ...sx.propTypes
}

export type FormGroupProps = ComponentProps<typeof FormGroup>
export type FormGroupLabelProps = ComponentProps<typeof Label>
export default Object.assign(FormGroup, {Label})
