import React, {forwardRef} from 'react'
import primitives from '@primer/primitives'
import {get} from '../constants'
import {TokenBaseProps, defaultTokenSize, tokenSizes} from './TokenBase'
import Token from './Token'
import {Avatar} from '..'

export interface AvatarTokenProps extends TokenBaseProps {
  avatarSrc: string
}

const AvatarToken = forwardRef<HTMLElement, AvatarTokenProps>(({avatarSrc, id, size, ...rest}, forwardedRef) => {
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

AvatarToken.defaultProps = {
  size: defaultTokenSize
}

AvatarToken.displayName = 'AvatarToken'

export default AvatarToken
