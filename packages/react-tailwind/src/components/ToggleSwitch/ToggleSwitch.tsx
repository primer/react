import {Switch as BaseSwitch} from '@base-ui/react/switch'
import React from 'react'
import {cn} from '../../internal/cn'

const rootClassName =
  'relative inline-flex shrink-0 cursor-pointer appearance-none overflow-hidden rounded-md border border-[var(--controlTrack-borderColor-rest)] bg-[var(--controlTrack-bgColor-rest)] p-0 outline-none transition-colors duration-[var(--base-duration-100)] [&:not([data-disabled]):hover]:bg-[var(--controlTrack-bgColor-hover)] [&:not([data-disabled]):active]:bg-[var(--controlTrack-bgColor-active)] data-[checked]:border-[var(--control-checked-borderColor-rest)] data-[checked]:bg-[var(--control-checked-bgColor-rest)] data-[checked]:[&:not([data-disabled]):hover]:bg-[var(--control-checked-bgColor-hover)] data-[checked]:[&:not([data-disabled]):active]:bg-[var(--control-checked-bgColor-active)] data-[disabled]:cursor-not-allowed data-[disabled]:border-transparent data-[disabled]:bg-[var(--controlTrack-bgColor-disabled)] focus-visible:outline-[var(--focus-outline)] focus-visible:outline-offset-[3px]'

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
          cn(rootClassName, size === 'small' ? 'h-6 w-12' : 'h-8 w-16', className(state))
      : cn(rootClassName, size === 'small' ? 'h-6 w-12' : 'h-8 w-16', className)

  return (
    <BaseSwitch.Root {...rest} ref={ref} data-component="ToggleSwitch" data-size={size} className={mergedClassName}>
      <BaseSwitch.Thumb
        className={cn(
          'absolute top-px bottom-px left-px block w-1/2 rounded-[calc(var(--borderRadius-default)-var(--borderWidth-thick))] border border-[var(--controlKnob-borderColor-rest)] bg-[var(--controlKnob-bgColor-rest)] transition-transform duration-[var(--base-duration-100)] data-[checked]:translate-x-[calc(100%_-_2px)] data-[checked]:border-[var(--controlKnob-borderColor-checked)] data-[disabled]:border-[var(--controlTrack-bgColor-disabled)] data-[disabled]:bg-[var(--controlKnob-bgColor-disabled)]',
        )}
      />
    </BaseSwitch.Root>
  )
})

ToggleSwitch.displayName = 'ToggleSwitch'
