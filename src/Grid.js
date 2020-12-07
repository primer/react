import styled from 'styled-components'
import {GRID} from './constants'
import theme from './theme'
import Box from './Box'

const Grid = styled(Box)`
  ${GRID};
`

Grid.defaultProps = {
  theme,
  display: 'grid',
}

Grid.propTypes = {
  ...Box.propTypes,
  ...GRID.propTypes,
}

export default Grid
