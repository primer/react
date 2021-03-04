import styled from 'styled-components'
import {COMMON, FLEX, LAYOUT, SystemCommonProps, SystemFlexProps, SystemLayoutProps} from './constants'
import sx, {SxProp} from './sx'
import {ComponentPropsWithAs} from './utils/types'

const Box = styled.div<SystemCommonProps & SystemFlexProps & SystemLayoutProps & SxProp>`
  ${COMMON}
  ${FLEX}
  ${LAYOUT}
  ${sx};
`

export type BoxProps = ComponentPropsWithAs<typeof Box>
export default Box
