import {cn} from '../../internal/cn'
import type {ControlSize} from '../../utils/types'

export interface IconButtonClassNameOptions {
  inactive?: boolean
  size?: ControlSize
  variant?: 'default' | 'primary' | 'danger' | 'invisible' | 'link'
}

/** Squares a button around its icon and gives the icon its variant colour. Icon links share it with `IconButton`. */
export function getIconButtonClassName({inactive, size = 'medium', variant = 'default'}: IconButtonClassNameOptions) {
  return cn(
    'inline-flex min-w-0 shrink-0 justify-center p-0 [&_[data-component=text]>svg]:block',
    !inactive && variant === 'default' && 'text-muted',
    !inactive && variant === 'invisible' && 'text-[var(--button-invisible-iconColor-rest)]',
    size === 'small' ? 'size-7' : size === 'large' ? 'size-10' : 'size-8',
  )
}
