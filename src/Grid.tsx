import styled from 'styled-components'
import Box, {BoxProps} from './Box'

export type GridProps = BoxProps

/**
 * @deprecated Please use the Box component instead.
 */
const Grid = styled(Box)``

Grid.defaultProps = {
  display: 'grid'
}

export default Grid
