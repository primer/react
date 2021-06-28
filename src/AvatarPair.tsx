import React from 'react'
import styled from 'styled-components'
import Avatar from './Avatar'
import {get} from './constants'
import {Box, BoxProps} from '.'

const ChildAvatar = styled(Avatar)`
  position: absolute;
  right: -15%;
  bottom: -9%;
  box-shadow: ${get('shadows.avatar.childShadow')};
`

export type AvatarPairProps = BoxProps

const AvatarPair = ({children, ...rest}: AvatarPairProps) => {
  const avatars = React.Children.map(children, (child, i) => {
    if (!React.isValidElement(child)) return child
    return i === 0 ? React.cloneElement(child, {size: 40}) : <ChildAvatar bg="bg.canvas" {...child.props} size={20} />
  })
  return (
    <Box position="relative" display="inline-flex" {...rest}>
      {avatars}
    </Box>
  )
}

// styled() changes this
AvatarPair.displayName = 'AvatarPair'

export default AvatarPair
