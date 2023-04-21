import styled from 'styled-components'
import {get} from '../constants'
import sx, {SxProp} from '../sx'
import {ComponentProps} from '../utils/types'

const FormGroup = styled.div<SxProp>`
  margin: ${get('space.3')} 0;
  font-weight: ${get('fontWeights.normal')};
  ${sx};
`

/** @deprecated Use FormControl instead. See https://primer.style/react/FormControl for more details. */
const FormGroupLabel = styled.label<SxProp>`
  display: block;
  margin: 0 0 ${get('space.2')};
  font-size: ${get('fontSizes.1')};
  font-weight: ${get('fontWeights.bold')};
  ${sx};
`

FormGroupLabel.displayName = 'FormGroup.Label'

export type FormGroupProps = ComponentProps<typeof FormGroup>
export type FormGroupLabelProps = ComponentProps<typeof FormGroupLabel>
/** @deprecated Use FormControl instead. See https://primer.style/react/FormControl for more details. */
export default Object.assign(FormGroup, {Label: FormGroupLabel})
