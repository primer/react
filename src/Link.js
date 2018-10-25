import PropTypes from 'prop-types'
import styled from 'react-emotion'
import {withSystemProps, TYPOGRAPHY} from './system-props'
import theme from './theme'
import {style} from 'styled-system'

const hoverColor = style({
  prop: 'hoverColor',
  cssProperty: 'color',
  key: 'colors'
})

const Link = ({is: Tag, className, children, ...rest}) => {
  className = Tag === 'button' ? `${className} btn-link` : className
  return <Tag {...rest} className={className}>{children}</Tag>
}

const styledLink = styled(Link)`
  text-decoration: ${props => (props.underline ? 'underline' : 'none')};
  &:hover {
    text-decoration: underline;
    ${hoverColor};
  }
`

styledLink.defaultProps = {
  theme,
  is: 'a'
}

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
