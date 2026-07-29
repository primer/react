import React from 'react'
import {cn} from '../../internal/cn'
import {IconButton} from '../IconButton'
import {Tooltip} from '../Tooltip'

export type TextInputActionDirection = 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw'

export interface TextInputActionProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label' | 'children'> {
  /** Accessible name for the action, since the icon alone conveys nothing. */
  'aria-label': string
  /** Icon component to render. */
  icon: React.ElementType
  /** Side the tooltip appears on. */
  tooltipDirection?: TextInputActionDirection
}

const tooltipPlacement: Record<
  TextInputActionDirection,
  {align: 'start' | 'center' | 'end'; side: 'top' | 'right' | 'bottom' | 'left'}
> = {
  n: {align: 'center', side: 'top'},
  ne: {align: 'end', side: 'top'},
  e: {align: 'center', side: 'right'},
  se: {align: 'end', side: 'bottom'},
  s: {align: 'center', side: 'bottom'},
  sw: {align: 'start', side: 'bottom'},
  w: {align: 'center', side: 'left'},
  nw: {align: 'start', side: 'top'},
}

export const TextInputAction = React.forwardRef<HTMLElement, TextInputActionProps>(function TextInputAction(
  {'aria-label': ariaLabel, className, icon, tooltipDirection = 's', type = 'button', ...rest},
  ref,
) {
  const placement = tooltipPlacement[tooltipDirection]
  const button = (
    <IconButton
      {...rest}
      ref={ref}
      aria-label={ariaLabel}
      className={cn(
        'relative inline-grid size-[var(--text-input-action-size)] border border-transparent bg-transparent px-1 py-0.5 text-muted shadow-none hover:bg-transparent hover:text-default [&_svg]:block',
        className,
      )}
      icon={icon}
      size="small"
      type={type}
      variant="invisible"
    />
  )

  return (
    <span className="mx-1 self-center leading-none" data-component="TextInput.Action">
      <Tooltip.Root>
        <Tooltip.Trigger render={button} />
        <Tooltip.Content align={placement.align} side={placement.side}>
          {ariaLabel}
        </Tooltip.Content>
      </Tooltip.Root>
    </span>
  )
})

TextInputAction.displayName = 'TextInput.Action'
