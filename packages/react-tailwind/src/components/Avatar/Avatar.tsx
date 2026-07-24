import {cva, type VariantProps} from 'class-variance-authority'
import React from 'react'
import {cn} from '../../internal/cn'

const avatarVariants = cva('inline-block shrink-0 bg-muted object-cover', {
  variants: {
    size: {small: 'size-5', medium: 'size-8', large: 'size-10', xlarge: 'size-12'},
    shape: {circle: 'rounded-full', square: 'rounded-md'},
  },
  defaultVariants: {size: 'small', shape: 'circle'},
})

export interface AvatarProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'size'>,
    Omit<VariantProps<typeof avatarVariants>, 'size'> {
  size?: 'small' | 'medium' | 'large' | 'xlarge' | number
  square?: boolean
}

export const Avatar = React.forwardRef<HTMLImageElement, AvatarProps>(function Avatar(
  {alt = '', className, height, shape, size, square, style, width, ...rest},
  ref,
) {
  const numericSize = typeof size === 'number' ? size : undefined
  return (
    <img
      {...rest}
      ref={ref}
      alt={alt}
      width={width ?? numericSize}
      height={height ?? numericSize}
      data-component="Avatar"
      data-shape={square ? 'square' : shape}
      className={cn(
        avatarVariants({shape: square ? 'square' : shape, size: typeof size === 'number' ? undefined : size}),
        className,
      )}
      style={style}
    />
  )
})

Avatar.displayName = 'Avatar'
