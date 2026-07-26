'use client'

import {Switch as BaseSwitch} from '@base-ui/react/switch'
import React from 'react'
import {cn} from '../../internal/cn'
import {useFormControlForwardedProps} from '../FormControl/useFormControlForwardedProps'

const rootClassName =
  'group relative inline-flex shrink-0 cursor-pointer appearance-none overflow-hidden rounded-md border border-[var(--controlTrack-borderColor-rest)] bg-[var(--controlTrack-bgColor-rest)] p-0 outline-none transition-colors duration-[var(--base-duration-100)] [&:not([data-disabled]):hover]:bg-[var(--controlTrack-bgColor-hover)] [&:not([data-disabled]):active]:bg-[var(--controlTrack-bgColor-active)] data-[checked]:border-[var(--control-checked-borderColor-rest)] data-[checked]:bg-[var(--control-checked-bgColor-rest)] data-[checked]:[&:not([data-disabled]):hover]:bg-[var(--control-checked-bgColor-hover)] data-[checked]:[&:not([data-disabled]):active]:bg-[var(--control-checked-bgColor-active)] data-[disabled]:cursor-not-allowed data-[disabled]:border-transparent data-[disabled]:bg-[var(--controlTrack-bgColor-disabled)] focus-visible:outline-[var(--focus-outline)] focus-visible:outline-offset-[3px]'

function LineIcon({size}: {size: 'small' | 'medium'}) {
  return (
    <svg
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute top-1/2 hidden -translate-y-1/2 text-white group-data-[checked]:block',
        size === 'small' ? 'left-[6px] size-3' : 'left-2 size-4',
      )}
      fill="currentColor"
      viewBox="0 0 16 16"
    >
      <path fillRule="evenodd" d="M8 2a.75.75 0 0 1 .75.75v11.5a.75.75 0 0 1-1.5 0V2.75A.75.75 0 0 1 8 2Z" />
    </svg>
  )
}

function CircleIcon({size}: {size: 'small' | 'medium'}) {
  return (
    <svg
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute top-1/2 -translate-y-1/2 text-muted group-data-[checked]:hidden group-data-[disabled]:text-white',
        size === 'small' ? 'right-[6px] size-3' : 'right-2 size-4',
      )}
      fill="currentColor"
      viewBox="0 0 16 16"
    >
      <path fillRule="evenodd" d="M8 12.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12Z" />
    </svg>
  )
}

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
  const forwardedProps = useFormControlForwardedProps(rest)
  const mergedClassName =
    typeof className === 'function'
      ? (state: BaseSwitch.Root.State) =>
          cn(rootClassName, size === 'small' ? 'h-6 w-12' : 'h-8 w-16', className(state))
      : cn(rootClassName, size === 'small' ? 'h-6 w-12' : 'h-8 w-16', className)

  return (
    <BaseSwitch.Root
      {...forwardedProps}
      ref={ref}
      data-component="ToggleSwitch"
      data-size={size}
      className={mergedClassName}
    >
      <LineIcon size={size} />
      <CircleIcon size={size} />
      <BaseSwitch.Thumb
        className={cn(
          'absolute top-px bottom-px left-px block w-1/2 rounded-[calc(var(--borderRadius-default)-var(--borderWidth-thick))] border border-[var(--controlKnob-borderColor-rest)] bg-[var(--controlKnob-bgColor-rest)] transition-transform duration-[var(--base-duration-100)] data-[checked]:translate-x-[calc(100%_-_2px)] data-[checked]:border-[var(--controlKnob-borderColor-checked)] data-[disabled]:border-[var(--controlTrack-bgColor-disabled)] data-[disabled]:bg-[var(--controlKnob-bgColor-disabled)]',
        )}
      />
    </BaseSwitch.Root>
  )
})

ToggleSwitch.displayName = 'ToggleSwitch'
