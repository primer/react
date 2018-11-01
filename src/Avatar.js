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
  ${childStyles};
`

const getBackgroundColor = themeGet('colors.white', '#fff')

function AvatarImage({alt, size, ...rest}) {
  delete rest.isChild
  return <img alt={alt} width={size} height={size} {...rest} />
}

function borderRadius({isChild, size}) {
  const small = isChild === true || size <= 24
  return {
    borderRadius: small ? '2px' : '3px'
  }
}

function childStyles({isChild, ...rest}) {
  if (isChild === true) {
    return {
      position: 'absolute',
      right: '-15%',
      bottom: '-9%',
      backgroundColor: getBackgroundColor(rest),
      boxShadow: '-2px -2px 0 rgba(255,255,255,0.8)'
    }
  }
}

// styled() changes this
Avatar.displayName = 'Avatar'

Avatar.defaultProps = {
  size: 20
}

Avatar.propTypes = {
  alt: PropTypes.string.isRequired,
  isChild: PropTypes.bool,
  size: PropTypes.number,
  src: PropTypes.string
}

export default withSystemProps(Avatar, ['space'])
