import styled from 'styled-components'
import Box, {BoxProps} from './Box'

export type FlexProps = BoxProps

const Flex = styled(Box)``

Flex.defaultProps = {
  display: 'flex'
}

export default Flex
