import styled from 'styled-components'
import {TYPOGRAPHY, COMMON} from './constants'
import theme from './theme'


const Tag = ({is: Hello, children, theme, ...rest}) => <Hello children={children} {...rest} />

const Heading = styled(Tag)`
  ${TYPOGRAPHY}
  ${COMMON}
`

Heading.defaultProps = {
  theme,
  m: 0,
  fontSize: 5,
  is: 'h1'
}

export default Heading
