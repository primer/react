import React, {type CSSProperties} from 'react'
import {isResponsiveValue} from '../../hooks/useResponsiveValue'
import type {AvatarProps} from '../../Avatar'
import {DEFAULT_AVATAR_SIZE} from '../../Avatar/Avatar'
import {SkeletonBox} from './'
import classes from './SkeletonAvatar.module.css'
import {clsx} from 'clsx'
import {merge} from '../../sx'

export type SkeletonAvatarProps = Pick<AvatarProps, 'size' | 'square'> & {
  /** Class name for custom styling */
  className?: string
} & Omit<React.HTMLProps<HTMLDivElement>, 'size'>

export const SkeletonAvatar: React.FC<SkeletonAvatarProps> = ({
  size = DEFAULT_AVATAR_SIZE,
  square,
  className,
  style,
  ...rest
}) => {
  const responsive = isResponsiveValue(size)
  const cssSizeVars = {} as Record<string, string>

  if (responsive) {
    for (const [key, value] of Object.entries(size)) {
      cssSizeVars[`--avatarSize-${key}`] = `${value}px`
    }
  } else {
    cssSizeVars['--avatarSize-regular'] = `${size}px`
  }

  return (
    <SkeletonBox
      className={clsx(className, classes.SkeletonAvatar)}
      {...rest}
      data-component="SkeletonAvatar"
      data-responsive={responsive ? '' : undefined}
      data-square={square ? '' : undefined}
      style={merge(style as CSSProperties, cssSizeVars)}
    />
  )
}
