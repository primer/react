import {cva, type VariantProps} from 'class-variance-authority'
import React from 'react'
import {cn} from '../../internal/cn'

const avatarStackVariants = cva('inline-flex items-center', {
  variants: {
    variant: {cascade: '-space-x-2', stack: 'gap-1'},
    align: {left: '', right: 'flex-row-reverse'},
    shape: {circle: '', square: ''},
  },
  defaultVariants: {variant: 'cascade', align: 'left', shape: 'circle'},
})

export interface AvatarStackProps extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof avatarStackVariants> {
  as?: React.ElementType
  alignRight?: boolean
}

export const AvatarStack = React.forwardRef<HTMLElement, AvatarStackProps>(function AvatarStack(
  {align, alignRight, as: Component = 'span', className, shape, variant, ...rest},
  ref,
) {
  const resolvedAlign = alignRight ? 'right' : align
  return (
    <Component
      {...rest}
      ref={ref}
      data-component="AvatarStack"
      data-variant={variant}
      data-shape={shape}
      className={cn(avatarStackVariants({align: resolvedAlign, shape, variant}), className)}
    />
  )
})

AvatarStack.displayName = 'AvatarStack'
