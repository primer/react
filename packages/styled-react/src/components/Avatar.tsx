import {type AvatarProps as PrimerAvatarProps, Avatar as PrimerAvatar} from '@primer/react'
import {forwardRef} from 'react'
import type {StyledProps} from '../styled-props'
import {Box} from './Box'

type AvatarProps = PrimerAvatarProps & StyledProps
const Avatar = forwardRef<HTMLImageElement, AvatarProps>(function Avatar(props, ref) {
  return <Box {...props} as={PrimerAvatar} ref={ref} />
})

export {Avatar}
export type {AvatarProps}
