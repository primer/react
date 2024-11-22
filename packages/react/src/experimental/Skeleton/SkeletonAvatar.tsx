import React, {type CSSProperties} from 'react'
import {getBreakpointDeclarations} from '../../utils/getBreakpointDeclarations'
import {get} from '../../constants'
import {isResponsiveValue} from '../../hooks/useResponsiveValue'
import type {AvatarProps} from '../../Avatar'
import {DEFAULT_AVATAR_SIZE} from '../../Avatar/Avatar'
import {SkeletonBox} from './SkeletonBox'
import classes from './SkeletonAvatar.module.css'
import {clsx} from 'clsx'
import {useFeatureFlag} from '../../FeatureFlags'
import {merge} from '../../sx'
import {CSS_MODULE_FLAG} from './FeatureFlag'

export type SkeletonAvatarProps = Pick<AvatarProps, 'size' | 'square'> & {
  /** Class name for custom styling */
  className?: string
} & Omit<React.HTMLProps<HTMLDivElement>, 'size'>

const avatarSkeletonStyles = {
  '&[data-component="SkeletonAvatar"]': {
    borderRadius: '50%',
    boxShadow: `0 0 0 1px ${get('colors.avatar.border')}`,
    display: 'inline-block',
    lineHeight: get('lineHeights.condensedUltra'),
    height: 'var(--avatar-size)',
    width: 'var(--avatar-size)',
  },

  '&[data-square]': {
    borderRadius: 'clamp(4px, var(--avatar-size) - 24px, 6px)',
  },
}

export const SkeletonAvatar: React.FC<SkeletonAvatarProps> = ({
  size = DEFAULT_AVATAR_SIZE,
  square,
  className,
  style,
  ...rest
}) => {
  const responsive = isResponsiveValue(size)
  const cssSizeVars = {} as Record<string, string>
  const enabled = useFeatureFlag(CSS_MODULE_FLAG)
  const avatarSx = responsive
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

  if (enabled) {
    if (responsive) {
      for (const [key, value] of Object.entries(size)) {
        cssSizeVars[`--avatarSize-${key}`] = `${value}px`
      }
    } else {
      cssSizeVars['--avatarSize-regular'] = `${size}px`
    }
  }

  return (
    <SkeletonBox
      sx={enabled ? undefined : avatarSx}
      className={clsx(className, {[classes.SkeletonAvatar]: enabled})}
      {...rest}
      data-component="SkeletonAvatar"
      data-responsive={responsive ? '' : undefined}
      data-square={square ? '' : undefined}
      style={merge(style as CSSProperties, enabled ? cssSizeVars : {})}
    />
  )
}
