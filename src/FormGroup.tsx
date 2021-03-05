import styled from 'styled-components'
import {COMMON, get, SystemCommonProps, SystemTypographyProps, TYPOGRAPHY} from './constants'
import sx, {SxProp} from './sx'
import {ComponentProps} from './utils/types'

const FormGroup = styled.div<SystemCommonProps & SxProp>`
  margin: ${get('space.3')} 0;
  font-weight: ${get('fontWeights.normal')};
  ${COMMON};
  ${sx};
`

const FormGroupLabel = styled.label<SystemTypographyProps & SystemCommonProps & SxProp>`
  display: block;
  margin: 0 0 ${get('space.2')};
  font-size: ${get('fontSizes.1')};
  font-weight: ${get('fontWeights.bold')};
  ${TYPOGRAPHY};
  ${COMMON};
  ${sx};
`

FormGroupLabel.displayName = 'FormGroup.Label'

export type FormGroupProps = ComponentProps<typeof FormGroup>
export type FormGroupLabelProps = ComponentProps<typeof FormGroupLabel>
export default Object.assign(FormGroup, {Label: FormGroupLabel})
