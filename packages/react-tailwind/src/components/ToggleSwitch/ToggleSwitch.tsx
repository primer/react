'use client'

import {Switch as BaseSwitch} from '@base-ui/react/switch'
import React from 'react'
import {cn} from '../../internal/cn'
import {mergeRefs} from '../../internal/refs'
import {useFormControlForwardedProps} from '../FormControl/useFormControlForwardedProps'
import {AriaStatus} from '../LiveRegion'
import {Spinner} from '../Spinner'

const rootClassName =
  'group relative inline-flex shrink-0 cursor-pointer appearance-none overflow-hidden rounded-md border border-[var(--controlTrack-borderColor-rest)] bg-[var(--controlTrack-bgColor-rest)] p-0 outline-none transition-colors duration-[var(--base-duration-100)] [&:not([data-disabled],[data-loading]):hover]:bg-[var(--controlTrack-bgColor-hover)] [&:not([data-disabled],[data-loading]):active]:bg-[var(--controlTrack-bgColor-active)] data-[checked]:border-[var(--control-checked-borderColor-rest)] data-[checked]:bg-[var(--control-checked-bgColor-rest)] data-[checked]:[&:not([data-disabled],[data-loading]):hover]:bg-[var(--control-checked-bgColor-hover)] data-[checked]:[&:not([data-disabled],[data-loading]):active]:bg-[var(--control-checked-bgColor-active)] [&:is([data-disabled],[data-loading])]:cursor-not-allowed [&:is([data-disabled],[data-loading])]:border-transparent [&:is([data-disabled],[data-loading])]:bg-[var(--controlTrack-bgColor-disabled)] focus-visible:outline-[var(--focus-outline)] focus-visible:outline-offset-[3px]'

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
        'pointer-events-none absolute top-1/2 -translate-y-1/2 text-muted group-data-[checked]:hidden group-data-[disabled]:text-white group-data-[loading]:text-white',
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
  /** Size of the switch. */
  size?: 'small' | 'medium'
  /**
   * Whether the "on" and "off" status labels appear before or after the switch.
   * Only change this when the switch's alignment needs to be adjusted.
   */
  statusLabelPosition?: 'start' | 'end'
  /**
   * Text shown when the switch is on. Only customize it when there is a more specific label for the context.
   */
  buttonLabelOn?: string
  /**
   * Text shown when the switch is off. Only customize it when there is a more specific label for the context.
   */
  buttonLabelOff?: string
  /**
   * Whether the switch's value is being calculated. A loading switch shows a spinner and does not accept input.
   */
  loading?: boolean
  /**
   * Text describing what is loading, announced to assistive technology after `loadingLabelDelay`.
   */
  loadingLabel?: string
  /**
   * Delay in milliseconds before `loadingLabel` is announced while loading.
   */
  loadingLabelDelay?: number
}

/** A form-associated binary switch with a visible on/off status label. Use a nearby label to provide its accessible name. */
export const ToggleSwitch = React.forwardRef<HTMLElement, ToggleSwitchProps>(function ToggleSwitch(
  {
    buttonLabelOff = 'Off',
    buttonLabelOn = 'On',
    className,
    loading = false,
    loadingLabel = 'Loading',
    loadingLabelDelay = 2000,
    readOnly,
    size = 'medium',
    statusLabelPosition = 'start',
    ...rest
  },
  ref,
) {
  const {'aria-describedby': ariaDescribedBy, ...forwardedProps} = useFormControlForwardedProps(rest)
  const switchRef = React.useRef<HTMLElement>(null)
  const loadingLabelId = React.useId()
  const [loadingDelayElapsed, setLoadingDelayElapsed] = React.useState(false)
  const isLoadingLabelVisible = loading && loadingDelayElapsed
  const acceptsInteraction = !forwardedProps.disabled && !loading
  const sizeClassName = size === 'small' ? 'h-6 w-12' : 'h-8 w-16'
  const mergedClassName =
    typeof className === 'function'
      ? (state: BaseSwitch.Root.State) => cn(rootClassName, sizeClassName, className(state))
      : cn(rootClassName, sizeClassName, className)

  React.useEffect(() => {
    if (!loading) return
    const timeout = window.setTimeout(() => setLoadingDelayElapsed(true), loadingLabelDelay)
    return () => {
      window.clearTimeout(timeout)
      setLoadingDelayElapsed(false)
    }
  }, [loading, loadingLabelDelay])

  return (
    <span
      className={cn(
        'group/toggle-switch inline-flex items-center',
        statusLabelPosition === 'end' ? 'flex-row-reverse' : 'flex-row',
      )}
      data-component="ToggleSwitch.Container"
      data-status-label-position={statusLabelPosition}
    >
      <AriaStatus announceOnShow className="sr-only" id={loadingLabelId}>
        {isLoadingLabelVisible ? loadingLabel : null}
      </AriaStatus>
      {loading ? (
        <span
          className={cn('inline-flex', statusLabelPosition === 'end' && 'ml-2')}
          data-component="ToggleSwitch.Spinner"
        >
          <Spinner size="small" srText={null} />
        </span>
      ) : null}
      <span
        aria-hidden="true"
        className={cn(
          'relative mx-2 cursor-pointer text-default',
          size === 'small' ? 'text-xs' : 'text-sm',
          !acceptsInteraction && 'cursor-not-allowed text-muted',
        )}
        data-component="ToggleSwitch.StatusLabel"
        data-disabled={!acceptsInteraction || undefined}
        onClick={() => {
          if (acceptsInteraction && !readOnly) switchRef.current?.click()
        }}
      >
        <span className="block h-0 text-right invisible group-has-[[data-component=ToggleSwitch][data-checked]]/toggle-switch:visible group-has-[[data-component=ToggleSwitch][data-checked]]/toggle-switch:h-auto">
          {buttonLabelOn}
        </span>
        <span className="block text-right group-has-[[data-component=ToggleSwitch][data-checked]]/toggle-switch:invisible group-has-[[data-component=ToggleSwitch][data-checked]]/toggle-switch:h-0">
          {buttonLabelOff}
        </span>
      </span>
      <BaseSwitch.Root
        {...forwardedProps}
        aria-describedby={
          [isLoadingLabelVisible ? loadingLabelId : undefined, ariaDescribedBy].filter(Boolean).join(' ') || undefined
        }
        aria-disabled={loading || undefined}
        ref={mergeRefs(ref, switchRef)}
        data-component="ToggleSwitch"
        data-loading={loading || undefined}
        data-size={size}
        readOnly={readOnly || loading}
        className={mergedClassName}
      >
        <LineIcon size={size} />
        <CircleIcon size={size} />
        <BaseSwitch.Thumb
          className={cn(
            'absolute top-px bottom-px left-px block w-1/2 rounded-[calc(var(--borderRadius-default)-var(--borderWidth-thick))] border border-[var(--controlKnob-borderColor-rest)] bg-[var(--controlKnob-bgColor-rest)] transition-transform duration-[var(--base-duration-100)] data-[checked]:translate-x-[calc(100%_-_2px)] data-[checked]:border-[var(--controlKnob-borderColor-checked)] data-[disabled]:border-[var(--controlTrack-bgColor-disabled)] data-[disabled]:bg-[var(--controlKnob-bgColor-disabled)] group-data-[loading]:border-[var(--controlTrack-bgColor-disabled)] group-data-[loading]:bg-[var(--controlKnob-bgColor-disabled)]',
          )}
        />
      </BaseSwitch.Root>
    </span>
  )
})

ToggleSwitch.displayName = 'ToggleSwitch'
