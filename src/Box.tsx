import styled from 'styled-components'
import {
  COMMON,
  FLEX,
  LAYOUT,
  BORDER,
  SystemCommonProps,
  SystemBorderProps,
  SystemFlexProps,
  SystemLayoutProps
} from './constants'
import sx, {SxProp} from './sx'
import {ComponentProps} from './utils/types'

const Box = styled.div<SystemCommonProps & SystemFlexProps & SystemLayoutProps & SystemBorderProps & SxProp>`
  ${BORDER}
  ${COMMON}
  ${FLEX}
  ${LAYOUT}
  ${sx};
`

export type BoxProps = ComponentProps<typeof Box>
export default Box
