import styled from 'styled-components'
import Box from './Box'
import {ComponentPropsWithAs} from './utils/types'

const Flex = styled(Box)``

Flex.defaultProps = {
  display: 'flex'
}

export type FlexProps = ComponentPropsWithAs<typeof Flex>
export default Flex
