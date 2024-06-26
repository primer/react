import React, {type FC} from 'react'
import {getBreakpointDeclarations} from '../../utils/getBreakpointDeclarations'
import {get} from '../../constants'
import {isResponsiveValue} from '../../hooks/useResponsiveValue'
import type {AvatarProps} from '../../Avatar'
import {DEFAULT_AVATAR_SIZE} from '../../Avatar/Avatar'
import {SkeletonBox} from './SkeletonBox'

export type SkeletonAvatarProps = Pick<AvatarProps, 'size' | 'square'> & {
  /** Class name for custom styling */
  className?: string
}

const avatarSkeletonStyles = {
  '&[data-component="SkeletonAvatar"]': {
    borderRadius: '50%',
    boxShadow: `0 0 0 1px ${get('colors.avatar.border')}`,
    display: 'inline-block',
    lineHeight: get('lineHeights.condensedUltra'),
    height: 'var(--avatar-size)',
    width: 'var(--avatar-size)',
  },

  '&[data-avatar-shape="square"]': {
    borderRadius: 'clamp(4px, var(--avatar-size) - 24px, 6px)',
  },
}

/**
 * Skeleton avatars may be used to improve perceived performance by rendering a rough representation of an avatar in a block of content that is still loading.
 * @primerid skeleton_avatar
 * @primerstatus draft
 * @primera11yreviewed false
 */
export const SkeletonAvatar: FC<SkeletonAvatarProps> = ({size = DEFAULT_AVATAR_SIZE, square, ...rest}) => {
  const avatarSx = isResponsiveValue(size)
    ? {
        ...getBreakpointDeclarations(
          size,
          '--avatar-size' as keyof React.CSSProperties,
          value => `${value || DEFAULT_AVATAR_SIZE}px`,
        ),
        ...avatarSkeletonStyles,
      }
    : {
        '--avatar-size': `${size}px`,
        ...avatarSkeletonStyles,
      }

  return (
    <SkeletonBox
      sx={avatarSx}
      {...rest}
      data-component="SkeletonAvatar"
      data-avatar-shape={square ? 'square' : undefined}
    />
  )
}
