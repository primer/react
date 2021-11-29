import styled from 'styled-components'
import {get} from './constants'
import sx, {SxProp} from './sx'
import {ComponentProps} from './utils/types'

const LabelGroup = styled.span<SxProp>`
  & * {
    margin-right: ${get('space.1')};
  }
  & *:last-child {
    margin-right: 0;
  }
  ${sx};
`

export type LabelGroupProps = ComponentProps<typeof LabelGroup>
export default LabelGroup
