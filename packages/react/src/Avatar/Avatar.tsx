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
  src?: string
  /** Placeholder if no image is provided. */
  placeholder?: React.ReactNode
  /** Provide alt text when the Avatar is used without the user's name next to it. */
  alt?: string
  /** Additional class name. */
  className?: string
} & React.ComponentPropsWithoutRef<'img'>

const Avatar = React.forwardRef<HTMLImageElement | HTMLSpanElement, AvatarProps>(function Avatar(
  {alt = '', size = DEFAULT_AVATAR_SIZE, square = false, className, style, src, placeholder, ...rest},
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

  const [imageFailed, setImageFailed] = React.useState(false)

  React.useEffect(() => {
    setImageFailed(false)
  }, [src])

  if (!src || imageFailed) {
    return (
      <span
        data-component="Avatar"
        className={clsx(className, classes.Avatar)}
        ref={ref as React.Ref<HTMLSpanElement>}
        data-responsive={isResponsive ? '' : undefined}
        data-square={square ? '' : undefined}
        style={
          style
            ? {
                ...cssSizeVars,
                ...style,
              }
            : (cssSizeVars as React.CSSProperties)
        }
        {...rest}
      >
        <span aria-label={alt || undefined} role={placeholder ? 'img' : undefined}>
          {placeholder}
        </span>
      </span>
    )
  }

  return (
    <img
      data-component="Avatar"
      className={clsx(className, classes.Avatar)}
      ref={ref as React.Ref<HTMLImageElement>}
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
      {...rest}
      src={src}
      onError={() => setImageFailed(true)}
    />
  )
})

if (__DEV__) {
  Avatar.displayName = 'Avatar'
}

export default Avatar
