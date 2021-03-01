import styled from 'styled-components'
import {COMMON, FLEX, LAYOUT, SystemCommonProps, SystemFlexProps, SystemLayoutProps} from './constants'
import sx, {SxProp} from './sx'
import theme from './theme'
import {ComponentProps} from './utils/types'

const Box = styled.div<SystemCommonProps & SystemFlexProps & SystemLayoutProps & SxProp>`
  ${COMMON}
  ${FLEX}
  ${LAYOUT}
  ${sx};
`

Box.defaultProps = {theme}

export type BoxProps = ComponentProps<typeof Box>
export default Box
