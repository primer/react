import {clsx} from 'clsx'
import React from 'react'
import type {ResponsiveValue} from '../hooks/useResponsiveValue'
import {isResponsiveValue} from '../hooks/useResponsiveValue'
import classes from './Avatar.module.css'

export const DEFAULT_AVATAR_SIZE = 20

export type AvatarProps = {
  /** Sets the width and height of the avatar. */
  size?: number | ResponsiveValue<number>
  /** Sets the shape of the avatar to a square if true. If false, the avatar will be circular. */
  square?: boolean
  /** URL of the avatar image. When provided, the image takes precedence over the placeholder. */
  src?: string
  /** Text to display when no image URL is provided, such as a user's initials. */
  placeholder?: string
  /** Provide alt text when the Avatar is used without the user's name next to it. */
  alt?: string
  /** Additional class name. */
  className?: string
} & Omit<React.ComponentPropsWithoutRef<'img'>, 'src'>

const Avatar = React.forwardRef<HTMLElement, AvatarProps>(function Avatar(
  {alt = '', size = DEFAULT_AVATAR_SIZE, square = false, placeholder, src, className, style, ...rest},
  ref,
) {
  const isResponsive = isResponsiveValue(size)
  const cssSizeVars = {} as Record<string, string>

  if (isResponsive) {
    for (const [key, value] of Object.entries(size)) {
      cssSizeVars[`--avatarSize-${key}`] = `${value}px`
    }
  } else {
    cssSizeVars['--avatarSize-regular'] = `${size}px`
  }

  const sharedProps = {
    'data-component': 'Avatar',
    className: clsx(className, classes.Avatar),
    ref,
    'data-responsive': isResponsive ? '' : undefined,
    'data-square': square ? '' : undefined,
    style: style
      ? {
          ...cssSizeVars,
          ...style,
        }
      : (cssSizeVars as React.CSSProperties),
    ...rest,
  }

  if (src) {
    return (
      <img
        {...sharedProps}
        alt={alt}
        width={isResponsive ? undefined : size}
        height={isResponsive ? undefined : size}
        src={src}
      />
    )
  }

  return (
    <span
      {...sharedProps}
      role="img"
      aria-label={alt || placeholder || undefined}
      data-placeholder=""
    >
      {placeholder}
    </span>
  )
})

if (__DEV__) {
  Avatar.displayName = 'Avatar'
}

export default Avatar
