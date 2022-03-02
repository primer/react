import styled from 'styled-components'
import Box, {BoxProps} from '../Box'

export type GridProps = BoxProps

/**
 * @deprecated Use the Box component instead (i.e. <Grid> → <Box display="grid">)
 */
const Grid = styled(Box)``

Grid.defaultProps = {
  display: 'grid'
}

export default Grid
