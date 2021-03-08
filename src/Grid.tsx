import styled from 'styled-components'
import Box, {BoxProps} from './Box'
import {GRID, SystemGridProps} from './constants'
import {ForwardRefComponent, IntrinsicElement} from './utils/polymorphic'

export type GridProps = BoxProps & SystemGridProps

type GridComponent = ForwardRefComponent<IntrinsicElement<typeof Box>, GridProps>

const Grid = styled(Box)<GridProps>`
  ${GRID};
` as GridComponent

Grid.defaultProps = {
  display: 'grid'
}

export default Grid
