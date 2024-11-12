import React, {forwardRef} from 'react'
import styled from 'styled-components'
import {clsx} from 'clsx'
import {get} from '../constants'
import type {TokenBaseProps, TokenSizeKeys} from './TokenBase'
import {defaultTokenSize, tokenSizes} from './TokenBase'
import Token from './Token'
import Avatar from '../Avatar'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {toggleStyledComponent} from '../internal/utils/toggleStyledComponent'
import {useFeatureFlag} from '../FeatureFlags'
import classes from './AvatarToken.module.css'

// TODO: update props to only accept 'large' and 'xlarge' on the next breaking change
export interface AvatarTokenProps extends TokenBaseProps {
  avatarSrc: string
}

const CSS_MODULES_FEATURE_FLAG = 'primer_react_css_modules_team'

const AvatarContainer = toggleStyledComponent(
  CSS_MODULES_FEATURE_FLAG,
  'span',
  styled.span<{avatarSize: TokenSizeKeys}>`
    // 'space.1' is used because to match space from the left of the token to the left of the avatar
    // '* 2' is done to account for the top and bottom
    --spacing: calc(${get('space.1')} * 2);

    display: block;
    height: ${props => `calc(${tokenSizes[props.avatarSize]} - var(--spacing))`};
    width: ${props => `calc(${tokenSizes[props.avatarSize]} - var(--spacing))`};
  `,
)

const AvatarToken = forwardRef(({avatarSrc, id, size = defaultTokenSize, ...rest}, forwardedRef) => {
  const enabled = useFeatureFlag(CSS_MODULES_FEATURE_FLAG)

  return (
    <Token
      leadingVisual={() => (
        <AvatarContainer avatarSize={size} className={clsx(enabled && classes.AvatarContainer)} data-size={size}>
          <Avatar
            src={avatarSrc}
            size={parseInt(tokenSizes[size], 10)}
            className={classes.Avatar}
            style={!enabled ? {height: '100%', width: '100%'} : {}}
          />
        </AvatarContainer>
      )}
      size={size}
      id={id?.toString()}
      className={classes.Token}
      {...rest}
      ref={forwardedRef}
    />
  )
}) as PolymorphicForwardRefComponent<'span' | 'a' | 'button', AvatarTokenProps>

AvatarToken.displayName = 'AvatarToken'

export default AvatarToken
