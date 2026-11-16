import {cn} from '../../internal/cn'
import type {ControlSize} from '../../utils/types'

export interface IconButtonClassNameOptions {
  inactive?: boolean
  size?: ControlSize
  variant?: 'default' | 'primary' | 'danger' | 'invisible' | 'link'
}

/** Squares a button around its icon and gives the icon its variant colour. Icon links share it with `IconButton`. */
export function getIconButtonClassName({inactive, size = 'medium', variant = 'default'}: IconButtonClassNameOptions) {
  // Leave room for a 24px hit square inside the default rounded corners.
  return cn(
    'primer:inline-flex primer:min-w-0 primer:shrink-0 primer:justify-center primer:p-0 primer:[&_[data-component=text]>svg]:block',
    !inactive && variant === 'default' && 'primer:text-muted',
    !inactive && variant === 'invisible' && 'primer:text-[var(--button-invisible-iconColor-rest)]',
    size === 'small'
      ? 'primer:size-[max(28px,calc(var(--base-size-4)*7))]'
      : size === 'large'
        ? 'primer:size-[max(28px,calc(var(--base-size-4)*10))]'
        : 'primer:size-[max(28px,calc(var(--base-size-4)*8))]',
  )
}
