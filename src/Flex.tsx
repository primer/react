import styled from 'styled-components'
import Box, {BoxProps} from './Box'

export type FlexProps = BoxProps

/**
 * @deprecated Please use the Box component instead.
 */
const Flex = styled(Box)``

Flex.defaultProps = {
  display: 'flex'
}

export default Flex
