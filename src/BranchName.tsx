import styled from 'styled-components'
import {COMMON, get, SystemCommonProps} from './constants'
import sx, {SxProp} from './sx'
import theme from './theme'
import {ComponentProps} from './utils/types'

const BranchName = styled.a<SystemCommonProps & SxProp>`
  display: inline-block;
  padding: 2px 6px;
  font-size: ${get('fontSizes.0')};
  font-family: ${get('fonts.mono')};
  color: rgba(27, 31, 35, 0.6);
  background-color: #eaf5ff;
  border-radius: 3px;
  ${COMMON};
  ${sx};
`

BranchName.defaultProps = {
  theme
}

export type BranchNameProps = ComponentProps<typeof BranchName>
export default BranchName
