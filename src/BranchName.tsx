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
  color: ${get('colors.branchName.text')};
  background-color: ${get('colors.branchName.bg')};
  border-radius: ${get('radii.2')};
  ${COMMON};
  ${sx};
`

BranchName.defaultProps = {
  theme
}

export type BranchNameProps = ComponentProps<typeof BranchName>
export default BranchName
