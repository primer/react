import React from 'react'
import styled from 'react-emotion'
import {themeGet} from 'styled-system'
import Avatar from './Avatar'
import {withSystemProps} from './system-props'

const getBackgroundColor = themeGet('colors.white', '#fff')

const Wrapper = styled('div')`
  display: inline-flex;
  position: relative;
`

const childStyles = props => ({
  display: 'inline-block',
  overflow: 'hidden', // Ensure page layout in Firefox should images fail to load
  lineHeight: `${themeGet('lineHeights.condensedUltra', 1)}`,
  verticalAlign: 'middle',
  borderRadius: '2px',
  position: 'absolute',
  right: '-15%',
  bottom: '-9%',
  boxShadow: '-2px -2px 0 rgba(255,255,255,0.8)',
  backgroundColor: `${getBackgroundColor(props)}`
})

const AvatarPair = ({children}) => {
  const avatars = React.Children.map(children, (child, i) => {
    return i === 0
      ? React.cloneElement(child, {size: 40})
      : React.cloneElement(child, {size: 20, css: childStyles(child.props)})
  })
  return <Wrapper>{avatars}</Wrapper>
}

// styled() changes this
AvatarPair.displayName = 'AvatarPair'

AvatarPair.propTypes = {
  ...Avatar.propTypes
}

export default withSystemProps(AvatarPair, ['space'])
