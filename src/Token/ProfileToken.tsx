import React, {forwardRef} from 'react'
import primitives from '@primer/primitives'
import {get} from '../constants'
import {TokenBaseProps, defaultTokenSize, tokenSizes} from './TokenBase'
import Token from './Token'
import {Avatar} from '..'

export interface ProfileTokenProps extends TokenBaseProps {
  avatarSrc: string
}

const ProfileToken = forwardRef<HTMLElement, ProfileTokenProps>(({avatarSrc, id, size, ...rest}, forwardedRef) => {
  return (
    <Token
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
      sx={{
        paddingLeft: get('space.1')
      }}
      {...rest}
      ref={forwardedRef}
    />
  )
})

ProfileToken.defaultProps = {
  size: defaultTokenSize
}

ProfileToken.displayName = 'ProfileToken'

export default ProfileToken
