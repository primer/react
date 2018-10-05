import PropTypes from 'prop-types'
import styled from 'react-emotion'
import {withSystemProps, TYPOGRAPHY} from './system-props'
import {colors} from './theme'
import {themeGet} from 'styled-system'

const getHoverColor = (hoverColor = 'blue.5') => {
  const path = `colors.${hoverColor}`
  const fallback = colors.blue[5]
  return themeGet(path, fallback)
}

const hoverStyles = ({...rest}) => {
  return {
    color: getHoverColor(rest.hoverColor)(rest)
  }
}

const styledLink = styled('a')`
  text-decoration: ${props => (props.underline ? 'underline' : 'none')};
  &:hover {
    text-decoration: underline;
    ${hoverStyles};
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
