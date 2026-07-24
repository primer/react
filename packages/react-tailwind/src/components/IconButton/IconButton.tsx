import React from 'react'
import {Button, type ButtonProps} from '../Button'

export interface IconButtonProps extends Omit<ButtonProps, 'children' | 'leadingVisual' | 'trailingVisual'> {
  'aria-label': string
  icon: React.ElementType
}

export const IconButton = React.forwardRef<HTMLElement, IconButtonProps>(function IconButton(
  {icon: Icon, size = 'medium', ...rest},
  ref,
) {
  return (
    <Button {...rest} ref={ref} data-component="IconButton" size={size}>
      <Icon aria-hidden="true" />
    </Button>
  )
})
