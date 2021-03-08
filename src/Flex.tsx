import styled from 'styled-components'
import Box, {BoxProps} from './Box'
import {ForwardRefComponent, IntrinsicElement} from './utils/polymorphic'

export type FlexProps = BoxProps

type FlexComponent = ForwardRefComponent<IntrinsicElement<typeof Box>, FlexProps>

const Flex = styled(Box)`` as FlexComponent

Flex.defaultProps = {
  display: 'flex'
}

export default Flex
