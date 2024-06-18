import React from 'react'
import styled from 'styled-components'
import type {AvatarProps} from '../Avatar'
import Avatar from '../Avatar'
import {get} from '../constants'
import Box, {type BoxProps} from '../Box'
import {SkeletonAvatar} from '../drafts/Skeleton/SkeletonAvatar'

const StyledAvatarPair = styled(Box)`
  position: relative;
  display: inline-flex;

  [data-component='Avatar']:last-child,
  [data-component='SkeletonAvatar']:last-child {
    position: absolute;
    right: -15%;
    bottom: -9%;
    box-shadow: ${get('shadows.avatar.childShadow')};
  }

  [data-component='SkeletonAvatar']:last-child {
    box-shadow: inset ${get('shadows.avatar.childShadow')};
  }
`

export type AvatarPairProps = BoxProps

const AvatarPair = ({children, ...rest}: AvatarPairProps) => {
  const avatars = React.Children.map(children, (child, i) => {
    if (!React.isValidElement(child)) {
      return child
    }

    if (i === 0) {
      return React.cloneElement(child as React.ReactElement<AvatarProps>, {size: 40})
    }

    if (child.type === SkeletonAvatar) {
      return <SkeletonAvatar {...child.props} size={20} />
    }

    return <Avatar bg="canvas.default" {...child.props} size={20} />
  })

  return <StyledAvatarPair {...rest}>{avatars}</StyledAvatarPair>
}

// styled() changes this
AvatarPair.displayName = 'AvatarPair'

export default AvatarPair
