import React from 'react'
import {type BetterCssProperties, type BetterSystemStyleObject, type SxProp, merge} from '../../sx'
import {getBreakpointDeclarations} from '../../utils/getBreakpointDeclarations'
import {get} from '../../constants'
import {isResponsiveValue} from '../../hooks/useResponsiveValue'
import type {AvatarProps} from '../../Avatar'
import {DEFAULT_AVATAR_SIZE} from '../../Avatar/Avatar'
import {SkeletonBox} from './SkeletonBox'

export type SkeletonAvatarProps = Pick<AvatarProps, 'size' | 'square'> & SxProp

const avatarSkeletonStyles = {
  "&[data-component='SkeletonAvatar']": {
    borderRadius: '50%',
    boxShadow: `0 0 0 1px ${get('colors.avatar.border')}`,
    display: 'inline-block',
    lineHeight: get('lineHeights.condensedUltra'),
    height: 'var(--avatar-size)',
    width: 'var(--avatar-size)',
  },

  "&[data-avatar-shape='square']": {
    borderRadius: 'clamp(4px, var(--avatar-size) - 24px, 6px)',
  },
}

export const SkeletonAvatar: React.FC<SkeletonAvatarProps> = ({
  size = DEFAULT_AVATAR_SIZE,
  square,
  sx: sxProp = {},
  ...rest
}) => {
  const avatarSx = isResponsiveValue(size)
    ? merge<BetterCssProperties | BetterSystemStyleObject>(
        {
          ...getBreakpointDeclarations(
            size,
            '--avatar-size' as keyof React.CSSProperties,
            value => `${value || DEFAULT_AVATAR_SIZE}px`,
          ),
          ...avatarSkeletonStyles,
        },
        sxProp as SxProp,
      )
    : merge(
        {
          '--avatar-size': `${size}px`,
          ...avatarSkeletonStyles,
        } as React.CSSProperties,
        sxProp as SxProp,
      )

  return (
    <SkeletonBox
      sx={avatarSx}
      {...rest}
      data-component="SkeletonAvatar"
      data-avatar-shape={square ? 'square' : undefined}
    />
  )
}
