import {clsx} from 'clsx'
import type React from 'react'
import {isResponsiveValue} from '../hooks/useResponsiveValue'
import type {AvatarProps} from '../Avatar'
import {DEFAULT_AVATAR_SIZE} from '../Avatar/Avatar'
import {SkeletonBox} from '../Skeleton'
import {useLoadingVisibility} from '../loading'
import type {LoadingDelay} from '../loading'
import classes from './SkeletonAvatar.module.css'

interface SkeletonAvatarProps extends Omit<React.HTMLProps<HTMLElement>, 'size'>, LoadingDelay {
  /** Class name for custom styling */
  className?: string
  size?: AvatarProps['size']
  square?: AvatarProps['square']
}

function SkeletonAvatar({delay, size = DEFAULT_AVATAR_SIZE, square, className, style, ...rest}: SkeletonAvatarProps) {
  const {style: loadingStyle} = useLoadingVisibility(delay)
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
      style={{...style, ...cssSizeVars, ...loadingStyle}}
    />
  )
}

export {SkeletonAvatar}
export type {SkeletonAvatarProps}
