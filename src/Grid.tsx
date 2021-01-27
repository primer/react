import styled from 'styled-components'
import Box from './Box'
import {GRID, SystemGridProps} from './constants'
import theme from './theme'
import {ComponentProps} from './utils/types'

const Grid = styled(Box)<SystemGridProps>`
  ${GRID};
`

Grid.defaultProps = {
  theme,
  display: 'grid'
}

Grid.propTypes = {
  ...Box.propTypes,
  ...GRID.propTypes
}

export type GridProps = ComponentProps<typeof Grid>
export default Grid
