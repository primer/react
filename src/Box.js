import {LAYOUT} from './constants'
import styled from 'styled-components'
import theme from './theme'

const Box = styled.div`
 ${LAYOUT}
`

Box.defaultProps = {
  theme
}

Box.propTypes = {
  ...LAYOUT.propTypes,
}

export default Box
