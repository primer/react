'use client'

import {Switch as BaseSwitch} from '@base-ui/react/switch'
import React from 'react'
import {cn} from '../../internal/cn'
import {markFormControlInput} from '../../internal/formControlParts'
import {joinIdRefs} from '../../internal/idRefs'
import {mergeRefs} from '../../internal/refs'
import {useFormControlChoiceForwardedProps} from '../FormControl/useFormControlForwardedProps'
import {AriaStatus} from '../LiveRegion'
import {Spinner} from '../Spinner'

const switchTransition =
  'primer:duration-80 primer:ease-[cubic-bezier(0.5,1,0.89,1)] primer:motion-reduce:transition-none'

const rootClassName = cn(
  'primer:group primer:relative primer:block primer:min-w-[24px] primer:shrink-0 primer:cursor-pointer primer:appearance-none primer:overflow-visible primer:rounded-md primer:border-thin primer:border-[var(--controlTrack-borderColor-rest)] primer:bg-[var(--controlTrack-bgColor-rest)] primer:p-0 primer:transition-[background-color,border-color]',
  switchTransition,
  'primer:[&:not([data-disabled],[data-loading]):hover]:bg-[var(--controlTrack-bgColor-hover)] primer:[&:not([data-disabled],[data-loading]):focus-visible:not(:active)]:bg-[var(--controlTrack-bgColor-hover)] primer:[&:not([data-disabled],[data-loading]):active]:bg-[var(--controlTrack-bgColor-active)]',
  'primer:data-[checked]:border-[var(--control-checked-borderColor-rest)] primer:data-[checked]:bg-[var(--control-checked-bgColor-rest)] primer:data-[checked]:[&:not([data-disabled],[data-loading]):hover]:bg-[var(--control-checked-bgColor-hover)] primer:data-[checked]:[&:not([data-disabled],[data-loading]):focus-visible:not(:active)]:bg-[var(--control-checked-bgColor-hover)] primer:data-[checked]:[&:not([data-disabled],[data-loading]):active]:bg-[var(--control-checked-bgColor-active)]',
  'primer:[&:is([data-disabled],[data-loading])]:cursor-not-allowed primer:[&:is([data-disabled],[data-loading])]:border-transparent primer:[&:is([data-disabled],[data-loading])]:bg-[var(--controlTrack-bgColor-disabled)] primer:[&:is([data-disabled],[data-loading])]:transition-none primer:forced-colors:[&:is([data-disabled],[data-loading])]:border-[GrayText]',
  'primer:focus-visible:outline-2 primer:focus-visible:outline-offset-[3px] primer:focus-visible:outline-focus',
  'primer:before:absolute primer:before:-inset-x-px primer:before:top-1/2 primer:before:min-h-[max(24px,var(--control-minTarget-auto,1rem))] primer:before:-translate-y-1/2',
)

// Each icon fills half the track and slides out from under the knob, matching upstream's layout.
const iconContainerClassName = cn(
  'primer:flex-[1_0_50%] primer:leading-[0] primer:transition-transform',
  switchTransition,
)

function SwitchIcons({size}: {size: 'small' | 'medium'}) {
  const dimension = size === 'small' ? 12 : 16
  return (
    <span
      aria-hidden="true"
      className="primer:flex primer:size-full primer:items-center primer:overflow-hidden primer:text-center"
    >
      <span
        className={cn(
          iconContainerClassName,
          'primer:-translate-x-full primer:text-[var(--control-checked-fgColor-rest)] primer:group-data-[checked]:translate-x-0 primer:group-data-[disabled]:text-[var(--control-checked-fgColor-disabled)] primer:group-data-[loading]:text-[var(--control-checked-fgColor-disabled)]',
        )}
      >
        <svg aria-hidden="true" width={dimension} height={dimension} viewBox="0 0 16 16" fill="currentColor">
          <path fillRule="evenodd" d="M8 2a.75.75 0 0 1 .75.75v11.5a.75.75 0 0 1-1.5 0V2.75A.75.75 0 0 1 8 2Z" />
        </svg>
      </span>
      <span
        className={cn(
          iconContainerClassName,
          'primer:text-[var(--controlTrack-fgColor-rest)] primer:group-data-[checked]:translate-x-full primer:group-data-[disabled]:text-[var(--controlTrack-fgColor-disabled)] primer:group-data-[loading]:text-[var(--controlTrack-fgColor-disabled)]',
        )}
      >
        <svg aria-hidden="true" width={dimension} height={dimension} viewBox="0 0 16 16" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M8 12.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12Z"
          />
        </svg>
      </span>
    </span>
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
  const {'aria-describedby': ariaDescribedBy, ...forwardedProps} = useFormControlChoiceForwardedProps(rest)
  const switchRef = React.useRef<HTMLElement>(null)
  const loadingLabelId = React.useId()
  const [loadingDelayElapsed, setLoadingDelayElapsed] = React.useState(false)
  const isLoadingLabelVisible = loading && loadingDelayElapsed
  const acceptsInteraction = !forwardedProps.disabled && !loading
  const sizeClassName = size === 'small' ? 'primer:h-6 primer:w-12' : 'primer:h-8 primer:w-16'
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
        'primer:group/toggle-switch primer:inline-flex primer:min-h-[max(24px,var(--control-minTarget-auto,1rem))] primer:items-center',
        statusLabelPosition === 'end' ? 'primer:flex-row-reverse' : 'primer:flex-row',
      )}
      data-component="ToggleSwitch.Container"
      data-status-label-position={statusLabelPosition}
    >
      <AriaStatus announceOnShow className="primer:sr-only" id={loadingLabelId}>
        {isLoadingLabelVisible ? loadingLabel : null}
      </AriaStatus>
      {loading ? (
        <span
          className={cn('primer:inline-flex', statusLabelPosition === 'end' && 'primer:ml-2')}
          data-component="ToggleSwitch.Spinner"
        >
          <Spinner size="small" srText={null} />
        </span>
      ) : null}
      <span
        aria-hidden="true"
        className={cn(
          'primer:relative primer:mx-2 primer:grid primer:cursor-pointer primer:text-default',
          size === 'small' ? 'primer:text-xs' : 'primer:text-sm',
          !acceptsInteraction && 'primer:cursor-not-allowed primer:text-muted',
        )}
        data-component="ToggleSwitch.StatusLabel"
        data-disabled={!acceptsInteraction || undefined}
        onClick={() => {
          if (acceptsInteraction && !readOnly) switchRef.current?.click()
        }}
      >
        <span className="primer:col-start-1 primer:row-start-1 primer:text-right primer:invisible primer:group-has-[[data-component=ToggleSwitch][data-checked]]/toggle-switch:visible">
          {buttonLabelOn}
        </span>
        <span className="primer:col-start-1 primer:row-start-1 primer:text-right primer:group-has-[[data-component=ToggleSwitch][data-checked]]/toggle-switch:invisible">
          {buttonLabelOff}
        </span>
      </span>
      <BaseSwitch.Root
        {...forwardedProps}
        aria-describedby={joinIdRefs(isLoadingLabelVisible && loadingLabelId, ariaDescribedBy)}
        {...(loading ? {'aria-disabled': true} : {})}
        ref={mergeRefs(ref, switchRef)}
        data-component="ToggleSwitch"
        data-loading={loading || undefined}
        data-size={size}
        tabIndex={forwardedProps.tabIndex ?? 0}
        readOnly={readOnly || loading}
        className={mergedClassName}
      >
        <SwitchIcons size={size} />
        <BaseSwitch.Thumb
          className={cn(
            'primer:absolute primer:top-px primer:bottom-px primer:left-px primer:z-1 primer:block primer:w-1/2 primer:rounded-[calc(var(--borderRadius-default)-var(--borderWidth-thick))] primer:border-thin primer:border-[var(--controlKnob-borderColor-rest)] primer:bg-[var(--controlKnob-bgColor-rest)] primer:transition-transform primer:data-[checked]:translate-x-[calc(100%_-_2px)] primer:data-[checked]:border-[var(--controlKnob-borderColor-checked)] primer:data-[disabled]:border-[var(--controlTrack-bgColor-disabled)] primer:data-[disabled]:bg-[var(--controlKnob-bgColor-disabled)] primer:group-data-[loading]:border-[var(--controlTrack-bgColor-disabled)] primer:group-data-[loading]:bg-[var(--controlKnob-bgColor-disabled)]',
            switchTransition,
          )}
        />
      </BaseSwitch.Root>
    </span>
  )
})

ToggleSwitch.displayName = 'ToggleSwitch'

markFormControlInput(ToggleSwitch, {baseUiControlId: true, baseUiAccessibleLabel: true})
