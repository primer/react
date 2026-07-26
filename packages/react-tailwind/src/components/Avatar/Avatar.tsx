import {cva} from 'class-variance-authority'
import React from 'react'
import {cn} from '../../internal/cn'
import type {AvatarSize, ResponsiveValue} from '../../utils/types'

const avatarBaseClassName =
  'inline-block shrink-0 overflow-hidden object-cover leading-none align-middle shadow-[0_0_0_1px_var(--avatar-borderColor)]'
const avatarVariants = cva('', {
  variants: {
    size: {small: 'size-5', medium: 'size-8', large: 'size-10', xlarge: 'size-12'},
    shape: {circle: 'rounded-[50%]', square: 'rounded-md'},
  },
  defaultVariants: {size: 'small', shape: 'circle'},
})

export interface AvatarProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'size'> {
  shape?: 'circle' | 'square'
  size?: AvatarSize | number | ResponsiveValue<number>
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
              'size-[var(--avatar-size-narrow)] md:size-[var(--avatar-size-regular)] 2xl:size-[var(--avatar-size-wide)]',
              square || shape === 'square'
                ? 'rounded-[clamp(4px,calc(var(--avatar-size)-24px),var(--borderRadius-medium))]'
                : 'rounded-[50%]',
            )
          : avatarVariants({
              shape: square ? 'square' : shape,
              size: typeof size === 'string' ? size : undefined,
            }),
        (square || shape === 'square') &&
          'rounded-[clamp(4px,calc(var(--avatar-size)-24px),var(--borderRadius-medium))]',
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
