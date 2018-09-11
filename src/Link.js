import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import styled from 'react-emotion'
import {withSystemProps, COMMON} from './system-props'
import {colors} from './theme'


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
    color: scheme === 'gray-dark' ? colors.gray[9]
           : muted || scheme === 'gray' ? colors.gray[6]
           : colors.blue[5]
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
