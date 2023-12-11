import React from 'react'
import {AvatarProps} from '../../Avatar'
import {DEFAULT_AVATAR_SIZE} from '../../Avatar/Avatar'
import {BaseSkeletonBone} from './_BaseSkeletonBone'
import {isResponsiveValue} from '../../hooks/useResponsiveValue'
import {BetterCssProperties, BetterSystemStyleObject, SxProp, merge} from '../../sx'
import {getBreakpointDeclarations} from '../../utils/getBreakpointDeclarations'

export type SkeletonAvatarProps = Pick<AvatarProps, 'size' | 'square'> & SxProp

export const SkeletonAvatar: React.FC<SkeletonAvatarProps> = ({
  size = DEFAULT_AVATAR_SIZE,
  square,
  sx: sxProp = {},
}) => {
  const avatarSx = isResponsiveValue(size)
    ? merge<BetterCssProperties | BetterSystemStyleObject>(
        getBreakpointDeclarations(
          size,
          '--avatar-size' as keyof React.CSSProperties,
          value => `${value || DEFAULT_AVATAR_SIZE}px`,
        ),
        sxProp as SxProp,
      )
    : merge({'--avatar-size': `${size}px`} as React.CSSProperties, sxProp as SxProp)

  return (
    <BaseSkeletonBone data-component="SkeletonAvatar" data-avatar-shape={square ? 'square' : undefined} sx={avatarSx} />
  )
}
