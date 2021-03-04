import styled from 'styled-components'
import Box from './Box'
import {GRID, SystemGridProps} from './constants'
import {ComponentPropsWithAs} from './utils/types'

const Grid = styled(Box)<SystemGridProps>`
  ${GRID};
`

Grid.defaultProps = {
  display: 'grid'
}

export type GridProps = ComponentPropsWithAs<typeof Grid>
export default Grid
