import styled from 'styled-components'
import Box, {BoxProps} from './Box'

export type FlexProps = BoxProps

/**
 * @deprecated Use the Box component instead (i.e. <Flex> → <Box display="flex">)
 */
const Flex = styled(Box)``

Flex.defaultProps = {
  display: 'flex'
}

export default Flex
