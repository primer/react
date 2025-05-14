import {forwardRef} from 'react'
import type {TokenBaseProps} from './TokenBase'
import {defaultTokenSize, tokenSizes} from './TokenBase'
import Token from './Token'
import Avatar from '../Avatar'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import classes from './AvatarToken.module.css'
import {clsx} from 'clsx'

// TODO: update props to only accept 'large' and 'xlarge' on the next breaking change
export interface AvatarTokenProps extends TokenBaseProps {
  avatarSrc: string
}

const AvatarToken = forwardRef(({avatarSrc, id, size = defaultTokenSize, className, ...rest}, forwardedRef) => {
  return (
    <Token
      leadingVisual={() => (
        <span className={classes.AvatarContainer} data-size={size}>
          <Avatar src={avatarSrc} size={parseInt(tokenSizes[size], 10)} className={classes.Avatar} />
        </span>
      )}
      size={size}
      id={id?.toString()}
      className={clsx(classes.Token, className)}
      {...rest}
      ref={forwardedRef}
    />
  )
}) as PolymorphicForwardRefComponent<'span' | 'a' | 'button', AvatarTokenProps>
AvatarToken.displayName = 'AvatarToken'
export default AvatarToken
