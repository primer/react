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
    <span className="primer:mx-1 primer:self-center primer:leading-none" data-component="TextInput.Action">
      <IconButton
        {...rest}
        ref={ref}
        aria-label={ariaLabel}
        className={cn(
          'primer:relative primer:inline-grid primer:size-[var(--text-input-action-size)] primer:border-thin primer:border-transparent primer:bg-transparent primer:px-1 primer:py-0.5 primer:text-muted primer:shadow-none primer:hover:text-default primer:focus:text-default primer:[&_svg]:block',
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
