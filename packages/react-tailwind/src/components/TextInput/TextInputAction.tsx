import React from 'react'
import {cn} from '../../internal/cn'
import {IconButton} from '../IconButton'
import type {TooltipDirection} from '../Tooltip/direction'

export type TextInputActionDirection = TooltipDirection

export interface TextInputActionProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label' | 'children'> {
  /** Accessible name for the action, since the icon alone conveys nothing. */
  'aria-label': string
  /** Icon component to render. */
  icon: React.ElementType
  /** Side the tooltip appears on. */
  tooltipDirection?: TextInputActionDirection
}

export const TextInputAction = React.forwardRef<HTMLElement, TextInputActionProps>(function TextInputAction(
  {'aria-label': ariaLabel, className, icon, tooltipDirection = 's', type = 'button', ...rest},
  ref,
) {
  return (
    <span className="mx-1 self-center leading-none" data-component="TextInput.Action">
      <IconButton
        {...rest}
        ref={ref}
        aria-label={ariaLabel}
        className={cn(
          'relative inline-grid size-[var(--text-input-action-size)] border border-transparent bg-transparent px-1 py-0.5 text-muted shadow-none hover:text-default focus:text-default [&_svg]:block',
          className,
        )}
        icon={icon}
        size="small"
        tooltipDirection={tooltipDirection}
        type={type}
        variant="invisible"
      />
    </span>
  )
})

TextInputAction.displayName = 'TextInput.Action'
