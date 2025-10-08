import type React from 'react'
import {type CSSProperties} from 'react'
import {isResponsiveValue} from '../hooks/useResponsiveValue'
import type {AvatarProps} from '../Avatar'
import {DEFAULT_AVATAR_SIZE} from '../Avatar/Avatar'
import {SkeletonBox} from '../Skeleton'
import classes from './SkeletonAvatar.module.css'
import {clsx} from 'clsx'
import {merge} from '../sx'

interface SkeletonAvatarProps extends Omit<React.HTMLProps<HTMLElement>, 'size'> {
  /** Class name for custom styling */
  className?: string
  size?: AvatarProps['size']
  square?: AvatarProps['square']
}

function SkeletonAvatar({size = DEFAULT_AVATAR_SIZE, square, className, style, ...rest}: SkeletonAvatarProps) {
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

export {SkeletonAvatar}
export type {SkeletonAvatarProps}
