import React from 'react'
import PropTypes from 'prop-types'
import styled from 'react-emotion'
import {themeGet} from 'styled-system'
import {withSystemProps, TYPOGRAPHY} from './system-props'
import {colors} from './theme'

const styledLink = styled(Link)`
  ${textDecoration};
  &:hover {
    text-decoration: underline;
  }
  ${color};
`

function textDecoration({nounderline}) {
  return {
    textDecoration: nounderline ? 'none' : 'underline'
  }
}

function color({muted, scheme, ...rest}) {
  return {
    color:
      scheme === 'gray-dark'
        ? themeGet('colors.gray.9', colors.gray[9])(rest)
        : muted || scheme === 'gray'
          ? themeGet('colors.gray.6', colors.gray[6])(rest)
          : themeGet('colors.blue.5', colors.blue[5])(rest)
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

export default withSystemProps(styledLink, TYPOGRAPHY)
