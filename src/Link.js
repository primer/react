import styled from 'styled-components'
import {
  space,
  color,
  fontSize,
  fontWeight
} from 'styled-system'

const Link = styled.a`
  text-decoration: none;
  display: inline-block;
  &:hover { text-decoration: underline; }
  ${space}
  ${color}
  ${fontSize}
  ${fontWeight}
`

Link.defaultProps = {
  color: 'blue.5',
}

export default Link
