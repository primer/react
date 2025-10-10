import {type AvatarProps as PrimerAvatarProps, Avatar as PrimerAvatar} from '@primer/react'
import {forwardRef} from 'react'
import type {StyledProps} from '../styled-props'
import {Box} from './Box'

type AvatarProps = PrimerAvatarProps & StyledProps
const Avatar = forwardRef<HTMLImageElement, AvatarProps>(function Avatar(props, ref) {
  return <Box as={PrimerAvatar} ref={ref} {...props} />
})

// @ts-ignore -- TS doesn't know about the __SLOT__ property
Avatar.__SLOT__ = PrimerAvatar.__SLOT__

export {Avatar}
export type {AvatarProps}
