import React from 'react'
import PropTypes from 'prop-types'
import styled from 'react-emotion'
import {themeGet} from 'styled-system'
import {withSystemProps, TYPOGRAPHY} from './system-props'
import {colors} from './theme'

const styledLink = styled('a')`
  ${textDecoration};
    &:hover {
    text-decoration: underline;
  }
`

function textDecoration({underline}) {
  return {
    textDecoration: underline ? 'underline' : 'none'
  }
}

export default withSystemProps({
  is: styledLink,
  color: 'blue.4'
}, TYPOGRAPHY)
