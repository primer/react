import React from 'react'
import PropTypes from 'prop-types'
import styled from 'react-emotion'
import {themeGet} from 'styled-system'
import {withSystemProps} from './system-props'

const Avatar = styled(AvatarImage)`
  display: inline-block;
  overflow: hidden; // Ensure page layout in Firefox should images fail to load
  line-height: ${themeGet('lineHeights.condensedUltra', 1)};
  vertical-align: middle;
  ${borderRadius};
`

function borderRadius({size}) {
  return {
    borderRadius: size <= 24 ? '2px' : '3px'
  }
}

function AvatarImage({alt, size, ...rest}) {
  return <img alt={alt} width={size} height={size} {...rest} />
}

// styled() changes this
Avatar.displayName = 'Avatar'

Avatar.defaultProps = {
  size: 20,
  alt: "",
}

Avatar.propTypes = {
  alt: PropTypes.string.isRequired,
  size: PropTypes.number,
  src: PropTypes.string
}

export default withSystemProps(Avatar, ['space'])
