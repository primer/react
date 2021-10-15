import React, {forwardRef} from 'react'
import styled from 'styled-components'
import {get} from '../constants'
import {TokenBaseProps, defaultTokenSize, tokenSizes, TokenSizeKeys} from './TokenBase'
import Token from './Token'
import {Avatar} from '..'

export interface AvatarTokenProps extends TokenBaseProps {
  avatarSrc: string
}

const AvatarContainer = styled.span<{avatarSize: TokenSizeKeys}>`
  // 'space.1' is used because to match space from the left of the token to the left of the avatar
  // '* 2' is done to account for the top and bottom
  --spacing: calc(${get('space.1')} * 2);

  display: block;
  height: ${props => `calc(${tokenSizes[props.avatarSize]} - var(--spacing))`};
  width: ${props => `calc(${tokenSizes[props.avatarSize]} - var(--spacing))`};
`

const AvatarToken = forwardRef<HTMLElement, AvatarTokenProps>(({avatarSrc, id, size, ...rest}, forwardedRef) => {
  return (
    <Token
      leadingVisual={() => (
        <AvatarContainer avatarSize={size || defaultTokenSize}>
          <Avatar
            src={avatarSrc}
            size={parseInt(tokenSizes[size || defaultTokenSize], 10)}
            sx={{
              width: '100%',
              height: '100%'
            }}
          />
        </AvatarContainer>
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
