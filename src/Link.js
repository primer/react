import React from 'react'
import PropTypes from 'prop-types'
import styled from 'react-emotion'
import {withSystemProps, TYPOGRAPHY, COMMON} from './system-props'
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
  appearance: 'none'
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
  ${props => (props.is === 'button' ? buttonStyles : '')};
`

styledLink.defaultProps = {
  is: 'a',
  theme
}

styledLink.propTypes = {
  href: PropTypes.string,
  is: PropTypes.oneOf(['a', 'button', 'input', 'summary']),
  underline: PropTypes.bool
}

export default withSystemProps(
  {
    is: styledLink,
    color: 'blue.5'
  },
  [...TYPOGRAPHY, ...COMMON]
)
