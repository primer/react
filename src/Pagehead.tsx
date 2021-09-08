import styled from 'styled-components'
import {COMMON, get, SystemCommonProps} from './constants'
import sx, {SxProp} from './sx'
import {ComponentProps} from './utils/types'

const Pagehead = styled.div<SystemCommonProps & SxProp>`
  position: relative;
  padding-top: ${get('space.4')};
  padding-bottom: ${get('space.4')};
  margin-bottom: ${get('space.4')};
  border-bottom: 1px solid ${get('colors.border.default')};
  ${COMMON};
  ${sx};
`

export type PageheadProps = ComponentProps<typeof Pagehead>
export default Pagehead
