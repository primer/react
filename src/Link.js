import PropTypes from 'prop-types'
import styled from 'react-emotion'
import {withSystemProps, TYPOGRAPHY} from './system-props'
import theme from './theme'
import {style} from 'styled-system'

const buttonStyles = {
  display: 'inline-block',
  padding: '0',
  fontSize: 'inherit',
  whiteSpace: 'nowrap',
  cursor: 'pointer',
  userSelect: 'none',
  backgroundColor: 'transparent',
  border: '0',
  appearance: 'none',
}

const hoverColor = style({
  prop: 'hoverColor',
  cssProperty: 'color',
  key: 'colors'
})

const Link = ({is: Tag, ...rest}) => <Tag {...rest} />

const styledLink = styled(Link)`
  text-decoration: ${props => (props.underline ? 'underline' : 'none')};
  &:hover {
    text-decoration: underline;
    ${hoverColor};
  }
  ${props => props.is === 'button' ? buttonStyles : ''}
`

styledLink.defaultProps = {
  theme,
  is: 'a'
}

styledLink.propTypes = {
  href: PropTypes.string,
  underline: PropTypes.bool,
  is: PropTypes.oneOf(['a', 'button', 'input', 'summary'])
}

export default withSystemProps(
  {
    is: styledLink,
    color: 'blue.5'
  },
  TYPOGRAPHY
)
