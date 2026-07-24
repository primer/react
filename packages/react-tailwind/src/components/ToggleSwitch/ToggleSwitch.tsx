import {Switch as BaseSwitch} from '@base-ui/react/switch'
import React from 'react'
import {cn} from '../../internal/cn'

export interface ToggleSwitchProps
  extends Omit<BaseSwitch.Root.Props, 'className' | 'children' | 'data-component' | 'render'> {
  className?: BaseSwitch.Root.Props['className']
  size?: 'small' | 'medium'
}

/** A form-associated binary switch. Use a nearby label to provide its accessible name. */
export const ToggleSwitch = React.forwardRef<HTMLElement, ToggleSwitchProps>(function ToggleSwitch(
  {className, size = 'medium', ...rest},
  ref,
) {
  const mergedClassName =
    typeof className === 'function'
      ? (state: BaseSwitch.Root.State) =>
          cn(
            'inline-flex shrink-0 rounded-full bg-neutral-muted p-0.5 outline-none transition-colors data-[checked]:bg-accent-emphasis data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
            size === 'small' ? 'h-4 w-7' : 'h-5 w-9',
            className(state),
          )
      : cn(
          'inline-flex shrink-0 rounded-full bg-neutral-muted p-0.5 outline-none transition-colors data-[checked]:bg-accent-emphasis data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
          size === 'small' ? 'h-4 w-7' : 'h-5 w-9',
          className,
        )

  return (
    <BaseSwitch.Root {...rest} ref={ref} data-component="ToggleSwitch" data-size={size} className={mergedClassName}>
      <BaseSwitch.Thumb
        className={cn(
          'block rounded-full bg-default shadow-resting-xs transition-transform data-[checked]:translate-x-full',
          size === 'small' ? 'size-3' : 'size-4',
        )}
      />
    </BaseSwitch.Root>
  )
})

ToggleSwitch.displayName = 'ToggleSwitch'
