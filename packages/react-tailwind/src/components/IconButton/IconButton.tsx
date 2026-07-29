import React from 'react'
import {cn} from '../../internal/cn'
import {Button, type ButtonProps} from '../Button'

export interface IconButtonProps extends Omit<ButtonProps, 'children' | 'leadingVisual' | 'trailingVisual'> {
  /** Accessible name for the button. Required, because the icon alone conveys nothing to assistive technology. */
  'aria-label': string
  /** Icon component to render. */
  icon: React.ElementType
}

export const IconButton = React.forwardRef<HTMLElement, IconButtonProps>(function IconButton(
  {className, 'data-component': dataComponent = 'IconButton', icon: Icon, size = 'medium', ...rest},
  ref,
) {
  return (
    <Button
      {...rest}
      ref={ref}
      className={cn(
        'min-w-0 justify-center p-0 text-muted data-[disabled]:text-disabled disabled:text-disabled',
        size === 'small' ? 'size-7' : size === 'large' ? 'size-10' : 'size-8',
        className,
      )}
      data-component={dataComponent}
      size={size}
    >
      <Icon aria-hidden="true" className="block" />
    </Button>
  )
})
