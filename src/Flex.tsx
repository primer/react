import styled from 'styled-components'
import Box from './Box'
import theme from './theme'
import {ComponentProps} from './utils/types'

const Flex = styled(Box)``

Flex.defaultProps = {
  theme,
  display: 'flex'
}

export type FlexProps = ComponentProps<typeof Flex>
export default Flex
