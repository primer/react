import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import styled from 'react-emotion'
import {themeGet} from 'styled-system'
import {withSystemProps, COMMON} from './system-props'
import theme from './theme'


const styledLink = styled(Link)`
  ${textDecoration};
  &:hover {
    text-decoration: underline
  };
  ${color}
`

function textDecoration({nounderline}) {
  return {
    textDecoration: nounderline ? 'none' : 'underline'
  }
}

function color({muted, scheme}) {
  return {
    color: scheme === 'gray-dark' ? theme.colors.gray[9]
           : muted || scheme === 'gray' ? theme.colors.gray[6]
           : theme.colors.blue[5]
  }
}

function Link({children, className, ...rest}) {
  return (
    <a className={className} {...rest}>
      {children}
    </a>
  )
}

Link.propTypes = {
  href: PropTypes.string,
  muted: PropTypes.bool,
  nounderline: PropTypes.bool,
  scheme: PropTypes.oneOf(['gray', 'gray-dark'])
}

export default withSystemProps(styledLink, COMMON)
