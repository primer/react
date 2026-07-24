import React from 'react'
import {cn} from '../../internal/cn'
import {Button, type ButtonProps} from '../Button'

export interface IconButtonProps extends Omit<ButtonProps, 'children' | 'leadingVisual' | 'trailingVisual'> {
  'aria-label': string
  icon: React.ElementType
}

export const IconButton = React.forwardRef<HTMLElement, IconButtonProps>(function IconButton(
  {className, icon: Icon, size = 'medium', ...rest},
  ref,
) {
  return (
    <Button
      {...rest}
      ref={ref}
      className={cn(
        'min-w-0 justify-center p-0 text-muted',
        size === 'small' ? 'size-7' : size === 'large' ? 'size-10' : 'size-8',
        className,
      )}
      data-component="IconButton"
      size={size}
    >
      <Icon aria-hidden="true" />
    </Button>
  )
})
