import styled from 'styled-components'
import {COMMON, get, SystemCommonProps} from './constants'
import sx, {SxProp} from './sx'
import {ComponentPropsWithAs} from './utils/types'

const LabelGroup = styled.span<SystemCommonProps & SxProp>`
  ${COMMON}
  & * {
    margin-right: ${get('space.1')};
  }
  & *:last-child {
    margin-right: 0;
  }
  ${sx};
`

export type LabelGroupProps = ComponentPropsWithAs<typeof LabelGroup>
export default LabelGroup
