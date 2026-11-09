import {cva} from 'class-variance-authority'
import React from 'react'
import {cn} from '../../internal/cn'
import type {AvatarSize, ResponsiveValue} from '../../utils/types'

const avatarBaseClassName =
  'primer:inline-block primer:shrink-0 primer:overflow-hidden primer:object-cover primer:leading-none primer:align-middle primer:shadow-[0_0_0_1px_var(--avatar-borderColor)]'
const avatarVariants = cva('', {
  variants: {
    size: {small: 'primer:size-5', medium: 'primer:size-8', large: 'primer:size-10', xlarge: 'primer:size-12'},
    shape: {circle: 'primer:rounded-[50%]', square: 'primer:rounded-md'},
  },
  defaultVariants: {size: 'small', shape: 'circle'},
})

export interface AvatarProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'size'> {
  /** Corner treatment. `circle` suits a person, `square` suits an organization or other entity. */
  shape?: 'circle' | 'square'
  /** Rendered width and height in pixels. Accepts a responsive object to vary the size per viewport. */
  size?: AvatarSize | number | ResponsiveValue<number>
  /** Forces the square shape, taking precedence over `shape`. Kept for compatibility with `@primer/react`. */
  square?: boolean
}

export const Avatar = React.forwardRef<HTMLImageElement, AvatarProps>(function Avatar(
  {alt = '', className, height, shape, size, square, style, width, ...rest},
  ref,
) {
  const responsiveSize = typeof size === 'object' ? size : undefined
  const responsive = responsiveSize !== undefined
  const numericSize = typeof size === 'number' ? size : undefined
  const avatarSize =
    numericSize ?? (typeof size === 'string' ? {small: 20, medium: 32, large: 40, xlarge: 48}[size] : 20)
  const regularSize = responsiveSize?.regular
  const responsiveStyle = responsive
    ? ({
        '--avatar-size-narrow': `${responsiveSize.narrow ?? regularSize ?? 20}px`,
        '--avatar-size-regular': `${regularSize ?? responsiveSize.narrow ?? 20}px`,
        '--avatar-size-wide': `${responsiveSize.wide ?? regularSize ?? 20}px`,
      } as React.CSSProperties)
    : undefined
  return (
    <img
      {...rest}
      ref={ref}
      alt={alt}
      width={responsive ? undefined : (width ?? numericSize)}
      height={responsive ? undefined : (height ?? numericSize)}
      data-component="Avatar"
      data-responsive={responsive ? '' : undefined}
      data-shape={square ? 'square' : shape}
      data-square={square ? '' : undefined}
      className={cn(
        avatarBaseClassName,
        responsive
          ? cn(
              'primer:size-[var(--avatar-size-narrow)] primer:md:size-[var(--avatar-size-regular)] primer:2xl:size-[var(--avatar-size-wide)]',
              square || shape === 'square'
                ? 'primer:rounded-[clamp(4px,calc(var(--avatar-size)-24px),var(--borderRadius-medium))]'
                : 'primer:rounded-[50%]',
            )
          : avatarVariants({
              shape: square ? 'square' : shape,
              size: typeof size === 'string' ? size : undefined,
            }),
        (square || shape === 'square') &&
          'primer:rounded-[clamp(4px,calc(var(--avatar-size)-24px),var(--borderRadius-medium))]',
        className,
      )}
      style={{
        ...(responsiveStyle ?? {width: width ?? numericSize, height: height ?? numericSize}),
        ...(avatarSize ? {'--avatar-size': `${avatarSize}px`} : {}),
        ...(responsive ? {'--avatar-size': 'var(--avatar-size-regular)'} : {}),
        ...style,
      }}
    />
  )
})

Avatar.displayName = 'Avatar'
