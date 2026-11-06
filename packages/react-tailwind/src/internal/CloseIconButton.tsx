'use client'

import type {BaseUIEvent} from '@base-ui/react/types'
import {XIcon} from '@primer/octicons-react'
import React from 'react'
import {IconButton, type IconButtonProps} from '../components/IconButton'

export type CloseIconButtonProps = Omit<IconButtonProps, 'aria-label' | 'icon' | 'variant'> & {
  /**
   * Accessible name for the close button.
   * @default 'Close'
   */
  'aria-label'?: string
}

/**
 * Invisible `XIcon` button that dismisses the popup it sits in. Its tooltip opens on focus and would otherwise consume
 * Escape, so Escape is passed on to close the popup on the first press.
 */
export const CloseIconButton = React.forwardRef<HTMLElement, CloseIconButtonProps>(function CloseIconButton(
  {'aria-label': ariaLabel = 'Close', onKeyDown, ...rest},
  ref,
) {
  return (
    <IconButton
      {...rest}
      ref={ref}
      aria-label={ariaLabel}
      icon={XIcon}
      onKeyDown={event => {
        onKeyDown?.(event)
        if (event.key === 'Escape') (event as Partial<BaseUIEvent<typeof event>>).preventBaseUIHandler?.()
      }}
      variant="invisible"
    />
  )
})
