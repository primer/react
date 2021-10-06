import React, {forwardRef} from 'react'
import primitives from '@primer/primitives'
import {get} from '../constants'
import {TokenBaseProps, defaultTokenSize, tokenSizes} from './TokenBase'
import Token from './Token'
import {Avatar} from '..'

export interface ProfileTokenProps extends TokenBaseProps {
  avatarSrc: string
}

const ProfileToken = forwardRef<HTMLElement, ProfileTokenProps>(({avatarSrc, id, ref, size, ...rest}, forwardedRef) => {
  console.log('ProfileToken rest', rest)
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
      ref={forwardedRef}
      sx={{
        paddingLeft: get('space.1')
      }}
      {...rest}
    />
  )
})

ProfileToken.defaultProps = {
  size: defaultTokenSize
}

export default ProfileToken
