import styled from 'styled-components'
import Box from './Box'
import {ComponentProps} from './utils/types'

/**
 * @deprecated Please use the Box component instead.
 */
const Flex = styled(Box)``

Flex.defaultProps = {
  display: 'flex'
}

export type FlexProps = ComponentProps<typeof Flex>
export default Flex
