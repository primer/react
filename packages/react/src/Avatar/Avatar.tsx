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
  /** URL of the avatar image. */
  src: string
  /** Provide alt text when the Avatar is used without the user's name next to it. */
  alt?: string
  /** Additional class name. */
  className?: string
} & React.ComponentPropsWithoutRef<'img'>

const Avatar = React.forwardRef<HTMLImageElement, AvatarProps>(function Avatar(
  {alt = '', size = DEFAULT_AVATAR_SIZE, square = false, className, style, ...rest},
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

  return (
    <img
      {...rest}
      data-component="Avatar"
      className={clsx(className, classes.Avatar)}
      ref={ref}
      alt={alt}
      data-responsive={isResponsive ? '' : undefined}
      data-square={square ? '' : undefined}
      width={isResponsive ? undefined : size}
      height={isResponsive ? undefined : size}
      style={
        style
          ? {
              ...cssSizeVars,
              ...style,
            }
          : (cssSizeVars as React.CSSProperties)
      }
    />
  )
})

if (__DEV__) {
  Avatar.displayName = 'Avatar'
}

export default Avatar
