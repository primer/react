import {XIcon} from '@primer/octicons-react'
import React from 'react'
import {IconButton, type IconButtonProps} from '../components/IconButton'
import {cn} from './cn'
export type NarrowFullscreenCloseButtonProps = Omit<IconButtonProps, 'aria-label' | 'icon' | 'variant'> & {
  /** Accessible name for the close button. */
  'aria-label'?: string
}

/** Dismisses fullscreen content. It only appears while the content covers a narrow viewport. */
export const NarrowFullscreenCloseButton = React.forwardRef<HTMLElement, NarrowFullscreenCloseButtonProps>(
  function NarrowFullscreenCloseButton({'aria-label': ariaLabel = 'Close', className, ...rest}, ref) {
    return (
      <IconButton
        {...rest}
        ref={ref}
        aria-label={ariaLabel}
        icon={XIcon}
        variant="invisible"
        className={cn('absolute top-2 right-2 z-default hidden max-md:inline-flex', className)}
      />
    )
  },
)
