import styled from 'styled-components'
import {COMMON, FLEX, LAYOUT, SystemCommonProps, SystemFlexProps, SystemLayoutProps} from './constants'
import sx, {SxProp} from './sx'
import {ForwardRefComponent} from './utils/polymorphic'

const defaultElement = 'div'

export type BoxProps = SystemCommonProps & SystemFlexProps & SystemLayoutProps & SxProp

// type BoxComponent = ForwardRefComponent<typeof defaultElement, BoxProps>

const Box = styled.div<BoxProps>`
  ${COMMON}
  ${FLEX}
  ${LAYOUT}
  ${sx};
`

export default Box
