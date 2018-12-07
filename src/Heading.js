import styled from 'styled-components'
import {TYPOGRAPHY, COMMON, Base} from './constants'
import theme from './theme'

const Heading = styled(Base)`
  ${TYPOGRAPHY} ${COMMON};
`

Heading.defaultProps = {
  theme,
  m: 0,
  fontSize: 5,
  is: 'h1'
}

export default Heading
