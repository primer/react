import PropTypes from 'prop-types'
import styled from 'react-emotion'
import {withSystemProps, TYPOGRAPHY} from './system-props'

const styledLink = styled('a')`
  text-decoration: ${props => (props.underline ? 'underline' : 'none')};
  &:hover {
    text-decoration: underline;
  }
`

styledLink.propTypes = {
  href: PropTypes.string,
  underline: PropTypes.bool
}

export default withSystemProps(
  {
    is: styledLink,
    color: 'blue.5'
  },
  TYPOGRAPHY
)
