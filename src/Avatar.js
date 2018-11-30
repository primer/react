import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {themeGet, space, color} from 'styled-system'
import theme from './theme'

function borderRadius({size}) {
  return {
    borderRadius: size <= 24 ? '2px' : '3px'
  }
}

const Avatar = styled.img.attrs(props => ({
  height: props.size,
  width: props.size,
}))`
  display: inline-block;
  overflow: hidden; // Ensure page layout in Firefox should images fail to load
  line-height: ${themeGet('lineHeights.condensedUltra', 1)};
  vertical-align: middle;
  ${borderRadius};
  ${space} ${color};
`

Avatar.defaultProps = {
  theme,
  size: 20,
  alt: ''
}

Avatar.propTypes = {
  alt: PropTypes.string.isRequired,
  size: PropTypes.number,
  src: PropTypes.string
}

export default Avatar
