'use client'

import {XIcon} from '@primer/octicons-react'
import React from 'react'
import {IconButton, type IconButtonProps} from '../components/IconButton'
import {IconControlTooltipEscapeContext} from './IconControlTooltipContext'

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
  {'aria-label': ariaLabel = 'Close', ...rest},
  ref,
) {
  return (
    <IconControlTooltipEscapeContext.Provider value>
      <IconButton {...rest} ref={ref} aria-label={ariaLabel} icon={XIcon} variant="invisible" />
    </IconControlTooltipEscapeContext.Provider>
  )
})
