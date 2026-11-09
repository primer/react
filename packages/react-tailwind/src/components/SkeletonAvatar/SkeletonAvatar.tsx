import React from 'react'
import {cn} from '../../internal/cn'
import type {AvatarSize, ResponsiveValue} from '../../utils/types'
import {SkeletonBox} from '../SkeletonBox'

const sizeClasses = {small: 'primer:size-5', medium: 'primer:size-8', large: 'primer:size-10', xlarge: 'primer:size-12'}

export interface SkeletonAvatarProps extends React.HTMLAttributes<HTMLElement> {
  /** Width and height in pixels, matching the avatar it stands in for. */
  size?: AvatarSize | number | ResponsiveValue<number>
  /** Renders square corners, matching a square avatar. */
  square?: boolean
}

export const SkeletonAvatar = React.forwardRef<HTMLElement, SkeletonAvatarProps>(function SkeletonAvatar(
  {className, size = 'small', square = false, style, ...rest},
  ref,
) {
  const responsiveSize = typeof size === 'object' ? size : undefined
  const numericSize = typeof size === 'number' ? size : undefined
  const avatarSize =
    numericSize ?? (typeof size === 'string' ? {small: 20, medium: 32, large: 40, xlarge: 48}[size] : 20)
  return (
    <SkeletonBox
      as="span"
      {...rest}
      ref={ref}
      data-component="SkeletonAvatar"
      data-responsive={responsiveSize ? '' : undefined}
      data-square={square ? '' : undefined}
      width={responsiveSize ? undefined : numericSize}
      height={responsiveSize ? undefined : numericSize}
      className={cn(
        responsiveSize
          ? 'primer:size-[var(--skeleton-avatar-size-narrow)] primer:md:size-[var(--skeleton-avatar-size-regular)] primer:2xl:size-[var(--skeleton-avatar-size-wide)]'
          : sizeClasses[typeof size === 'string' ? size : 'small'],
        'primer:inline-block primer:leading-none',
        square
          ? 'primer:rounded-[clamp(4px,calc(var(--skeleton-avatar-size)-24px),var(--borderRadius-medium))]'
          : 'primer:rounded-full',
        className,
      )}
      style={
        {
          ...(responsiveSize
            ? {
                '--skeleton-avatar-size-narrow': `${responsiveSize.narrow ?? responsiveSize.regular ?? 20}px`,
                '--skeleton-avatar-size-regular': `${responsiveSize.regular ?? responsiveSize.narrow ?? 20}px`,
                '--skeleton-avatar-size-wide': `${responsiveSize.wide ?? responsiveSize.regular ?? 20}px`,
              }
            : {}),
          '--skeleton-avatar-size': responsiveSize ? 'var(--skeleton-avatar-size-regular)' : `${avatarSize}px`,
          ...style,
        } as React.CSSProperties
      }
    />
  )
})

SkeletonAvatar.displayName = 'SkeletonAvatar'
