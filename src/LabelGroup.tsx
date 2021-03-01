import styled from 'styled-components'
import {COMMON, get, SystemCommonProps} from './constants'
import sx, {SxProp} from './sx'
import theme from './theme'
import {ComponentProps} from './utils/types'

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

LabelGroup.defaultProps = {
  theme
}

export type LabelGroupProps = ComponentProps<typeof LabelGroup>
export default LabelGroup
