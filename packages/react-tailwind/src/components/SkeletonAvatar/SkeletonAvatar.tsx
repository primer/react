import React from 'react'
import {cn} from '../../internal/cn'

const sizeClasses = {small: 'size-5', medium: 'size-8', large: 'size-10', xlarge: 'size-12'}

export interface SkeletonAvatarProps extends React.HTMLAttributes<HTMLElement> {
  size?: keyof typeof sizeClasses | number
  square?: boolean
}

export const SkeletonAvatar = React.forwardRef<HTMLElement, SkeletonAvatarProps>(function SkeletonAvatar(
  {className, size = 'small', square = false, style, ...rest},
  ref,
) {
  const numericSize = typeof size === 'number' ? size : undefined
  return (
    <span
      {...rest}
      ref={ref}
      data-component="SkeletonAvatar"
      aria-busy="true"
      className={cn(
        'inline-block animate-pulse bg-neutral-muted motion-reduce:animate-none',
        sizeClasses[typeof size === 'string' ? size : 'small'],
        square ? 'rounded-md' : 'rounded-full',
        className,
      )}
      style={{width: numericSize, height: numericSize, ...style}}
    />
  )
})

SkeletonAvatar.displayName = 'SkeletonAvatar'
