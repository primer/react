import React, {forwardRef} from 'react'
import styled from 'styled-components'
import {get} from '../constants'
import primitives from '@primer/primitives'
import {TokenBaseProps, defaultTokenSize, tokenSizes} from './TokenBase'
import Token from './Token'
import {Avatar} from '..'

export interface ProfileTokenProps extends TokenBaseProps {
  avatarSrc: string
}

const StyledToken = styled(Token)`
  padding-left: ${get('space.1')};
`

const ProfileToken = forwardRef<HTMLElement, ProfileTokenProps>(({avatarSrc, id, ref, size, ...rest}, forwardedRef) => (
  <StyledToken
    leadingVisual={() => (
      <Avatar
        src={avatarSrc}
        size={
          parseInt(tokenSizes[size || defaultTokenSize], 10) - parseInt(primitives.spacing.normal.spacer[1], 10) * 2
        }
      />
    )}
    size={size}
    id={id?.toString()}
    ref={forwardedRef}
    {...rest}
  />
))

export default ProfileToken
