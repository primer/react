import React from 'react'
import type {AvatarProps} from '../../Avatar'
import {DEFAULT_AVATAR_SIZE} from '../../Avatar/Avatar'
import {BaseSkeletonBox} from './_BaseSkeletonBox'
import {isResponsiveValue} from '../../hooks/useResponsiveValue'
import {type BetterCssProperties, type BetterSystemStyleObject, type SxProp, merge} from '../../sx'
import {getBreakpointDeclarations} from '../../utils/getBreakpointDeclarations'

export type SkeletonAvatarProps = Pick<AvatarProps, 'size' | 'square'> & SxProp

export const SkeletonAvatar: React.FC<SkeletonAvatarProps> = ({
  size = DEFAULT_AVATAR_SIZE,
  square,
  sx: sxProp = {},
  ...rest
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
    <BaseSkeletonBox
      data-component="SkeletonAvatar"
      data-avatar-shape={square ? 'square' : undefined}
      sx={avatarSx}
      {...rest}
    />
  )
}
