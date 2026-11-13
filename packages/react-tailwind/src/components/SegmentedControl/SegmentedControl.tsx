'use client'

import {ToggleGroup} from '@base-ui/react/toggle-group'
import {Toggle} from '@base-ui/react/toggle'
import React from 'react'
import {cn} from '../../internal/cn'
import {renderIcon, type IconSource} from '../../internal/icon'
import {mergeClassName} from '../../internal/mergeClassName'
import {mergeRefs} from '../../internal/refs'
import {isPartOf, resolveRegions} from '../../internal/regions'
import {coarsePointerTouchTarget} from '../../internal/touchTarget'
import type {RegionProps, ResponsiveValue} from '../../utils/types'
import {ActionMenu} from '../ActionMenu'
import {CounterLabel} from '../CounterLabel'
import {IconButton as PrimerIconButton} from '../IconButton'
import {Tooltip, type TooltipDirection} from '../Tooltip'
import {tooltipDirectionPlacement} from '../Tooltip/direction'

export type SegmentedControlSize = 'small' | 'medium'
export type SegmentedControlVariant = 'default' | 'subtle' | 'hideLabels' | 'dropdown'

type ViewportRange = 'narrow' | 'regular' | 'wide'
type ResponsiveSegmentedControlVariant = Partial<Record<ViewportRange, SegmentedControlVariant>>
const emptyValues: readonly string[] = []
const viewportRanges: readonly ViewportRange[] = ['narrow', 'regular', 'wide']

export interface SegmentedControlProps<Value extends string = string>
  extends Omit<ToggleGroup.Props<Value>, 'className' | 'data-component' | 'multiple'>,
    RegionProps<'action'> {
  className?: ToggleGroup.Props<Value>['className']
  /** Stretches the control to fill its container, sharing the width between segments. */
  fullWidth?: ResponsiveValue<boolean>
  /** Height and text size of the segments. */
  size?: SegmentedControlSize
  /**
   * Visual treatment of the control. `subtle` drops the track for a lower-emphasis control. Pass an object to adapt per
   * viewport range, for example collapsing into a menu or hiding labels on narrow viewports.
   * @default 'default'
   */
  variant?: 'default' | 'subtle' | ResponsiveSegmentedControlVariant
}

// Every variant writes the same custom properties so a responsive variant can switch between them per viewport range.
const variantClasses: Record<ViewportRange, Record<'default' | 'subtle', string>> = {
  narrow: {
    default:
      'primer:border-thin primer:bg-[var(--controlTrack-bgColor-rest)] primer:[--segmented-control-outer-radius:var(--borderRadius-medium)] primer:[--segmented-control-button-bg-inset:var(--base-size-4)] primer:[--segmented-control-button-bgColor-hover:var(--controlTrack-bgColor-hover)] primer:[--segmented-control-knob-display:block] primer:[--segmented-control-separator-color:var(--borderColor-default)] primer:[--segmented-control-divider-display:none] primer:[--segmented-control-button-fgColor:currentColor] primer:[--segmented-control-button-pressed-fgColor:currentColor] primer:[--segmented-control-content-padding:var(--base-size-8)] primer:[--segmented-control-content-border-width:var(--borderWidth-thin)] primer:[--segmented-control-pressed-content-bg:initial]',
    subtle:
      'primer:border-0 primer:bg-transparent primer:[--segmented-control-outer-radius:var(--borderRadius-large)] primer:[--segmented-control-button-bg-inset:0px] primer:[--segmented-control-button-bgColor-hover:var(--button-invisible-bgColor-hover)] primer:[--segmented-control-knob-display:none] primer:[--segmented-control-separator-color:transparent] primer:[--segmented-control-divider-display:block] primer:[--segmented-control-button-fgColor:var(--fgColor-muted)] primer:[--segmented-control-button-pressed-fgColor:var(--fgColor-default)] primer:[--segmented-control-content-padding:var(--base-size-12)] primer:[--segmented-control-content-border-width:0px] primer:[--segmented-control-pressed-content-bg:var(--bgColor-muted)]',
  },
  regular: {
    default:
      'primer:md:border-thin primer:md:bg-[var(--controlTrack-bgColor-rest)] primer:md:[--segmented-control-outer-radius:var(--borderRadius-medium)] primer:md:[--segmented-control-button-bg-inset:var(--base-size-4)] primer:md:[--segmented-control-button-bgColor-hover:var(--controlTrack-bgColor-hover)] primer:md:[--segmented-control-knob-display:block] primer:md:[--segmented-control-separator-color:var(--borderColor-default)] primer:md:[--segmented-control-divider-display:none] primer:md:[--segmented-control-button-fgColor:currentColor] primer:md:[--segmented-control-button-pressed-fgColor:currentColor] primer:md:[--segmented-control-content-padding:var(--base-size-8)] primer:md:[--segmented-control-content-border-width:var(--borderWidth-thin)] primer:md:[--segmented-control-pressed-content-bg:initial]',
    subtle:
      'primer:md:border-0 primer:md:bg-transparent primer:md:[--segmented-control-outer-radius:var(--borderRadius-large)] primer:md:[--segmented-control-button-bg-inset:0px] primer:md:[--segmented-control-button-bgColor-hover:var(--button-invisible-bgColor-hover)] primer:md:[--segmented-control-knob-display:none] primer:md:[--segmented-control-separator-color:transparent] primer:md:[--segmented-control-divider-display:block] primer:md:[--segmented-control-button-fgColor:var(--fgColor-muted)] primer:md:[--segmented-control-button-pressed-fgColor:var(--fgColor-default)] primer:md:[--segmented-control-content-padding:var(--base-size-12)] primer:md:[--segmented-control-content-border-width:0px] primer:md:[--segmented-control-pressed-content-bg:var(--bgColor-muted)]',
  },
  wide: {
    default:
      'primer:2xl:border-thin primer:2xl:bg-[var(--controlTrack-bgColor-rest)] primer:2xl:[--segmented-control-outer-radius:var(--borderRadius-medium)] primer:2xl:[--segmented-control-button-bg-inset:var(--base-size-4)] primer:2xl:[--segmented-control-button-bgColor-hover:var(--controlTrack-bgColor-hover)] primer:2xl:[--segmented-control-knob-display:block] primer:2xl:[--segmented-control-separator-color:var(--borderColor-default)] primer:2xl:[--segmented-control-divider-display:none] primer:2xl:[--segmented-control-button-fgColor:currentColor] primer:2xl:[--segmented-control-button-pressed-fgColor:currentColor] primer:2xl:[--segmented-control-content-padding:var(--base-size-8)] primer:2xl:[--segmented-control-content-border-width:var(--borderWidth-thin)] primer:2xl:[--segmented-control-pressed-content-bg:initial]',
    subtle:
      'primer:2xl:border-0 primer:2xl:bg-transparent primer:2xl:[--segmented-control-outer-radius:var(--borderRadius-large)] primer:2xl:[--segmented-control-button-bg-inset:0px] primer:2xl:[--segmented-control-button-bgColor-hover:var(--button-invisible-bgColor-hover)] primer:2xl:[--segmented-control-knob-display:none] primer:2xl:[--segmented-control-separator-color:transparent] primer:2xl:[--segmented-control-divider-display:block] primer:2xl:[--segmented-control-button-fgColor:var(--fgColor-muted)] primer:2xl:[--segmented-control-button-pressed-fgColor:var(--fgColor-default)] primer:2xl:[--segmented-control-content-padding:var(--base-size-12)] primer:2xl:[--segmented-control-content-border-width:0px] primer:2xl:[--segmented-control-pressed-content-bg:var(--bgColor-muted)]',
  },
}

const layoutClasses = {
  narrow: {
    hidden: 'primer:hidden',
    fullWidth: 'primer:flex primer:w-full primer:[--segmented-control-icon-width:auto]',
    inline: 'primer:inline-flex',
    inlineAuto: 'primer:inline-flex primer:w-auto primer:[--segmented-control-icon-width:var(--control-medium-size)]',
    hideLabels: 'primer:[&_.segmentedControl-text]:hidden',
    showLabels: '',
    groupedFullWidth: 'primer:flex-auto',
    groupedInline: 'primer:flex-initial',
    groupFullWidth: 'primer:w-full',
    groupInline: 'primer:w-auto',
    dropdownShown: 'primer:flex',
    dropdownHidden: 'primer:hidden',
    actionShown: 'primer:flex',
    actionHidden: 'primer:hidden',
  },
  regular: {
    hidden: 'primer:md:hidden',
    fullWidth: 'primer:md:flex primer:md:w-full primer:md:[--segmented-control-icon-width:auto]',
    inline: 'primer:md:inline-flex',
    inlineAuto:
      'primer:md:inline-flex primer:md:w-auto primer:md:[--segmented-control-icon-width:var(--control-medium-size)]',
    hideLabels: 'primer:md:[&_.segmentedControl-text]:hidden',
    showLabels: 'primer:md:[&_.segmentedControl-text]:block',
    groupedFullWidth: 'primer:md:flex-auto',
    groupedInline: 'primer:md:flex-initial',
    groupFullWidth: 'primer:md:w-full',
    groupInline: 'primer:md:w-auto',
    dropdownShown: 'primer:md:flex',
    dropdownHidden: 'primer:md:hidden',
    actionShown: 'primer:md:flex',
    actionHidden: 'primer:md:hidden',
  },
  wide: {
    hidden: 'primer:2xl:hidden',
    fullWidth: 'primer:2xl:flex primer:2xl:w-full primer:2xl:[--segmented-control-icon-width:auto]',
    inline: 'primer:2xl:inline-flex',
    inlineAuto:
      'primer:2xl:inline-flex primer:2xl:w-auto primer:2xl:[--segmented-control-icon-width:var(--control-medium-size)]',
    hideLabels: 'primer:2xl:[&_.segmentedControl-text]:hidden',
    showLabels: 'primer:2xl:[&_.segmentedControl-text]:block',
    groupedFullWidth: 'primer:2xl:flex-auto',
    groupedInline: 'primer:2xl:flex-initial',
    groupFullWidth: 'primer:2xl:w-full',
    groupInline: 'primer:2xl:w-auto',
    dropdownShown: 'primer:2xl:flex',
    dropdownHidden: 'primer:2xl:hidden',
    actionShown: 'primer:2xl:flex',
    actionHidden: 'primer:2xl:hidden',
  },
} satisfies Record<ViewportRange, Record<string, string>>

interface ResolvedRange {
  range: ViewportRange
  variant: SegmentedControlVariant
  fullWidth: boolean | undefined
}

/** Resolves the variant and width per viewport range. Plain values only need the unprefixed range. */
function resolveRanges(
  variant: SegmentedControlProps['variant'],
  fullWidth: ResponsiveValue<boolean> | undefined,
): ResolvedRange[] {
  const responsive = typeof variant === 'object' || typeof fullWidth === 'object'
  return (responsive ? viewportRanges : viewportRanges.slice(0, 1)).map(range => ({
    range,
    variant: (typeof variant === 'object' ? variant[range] : variant) ?? 'default',
    fullWidth: typeof fullWidth === 'object' ? fullWidth[range] : fullWidth,
  }))
}

const knobClassName = cn(
  'primer:supports-[anchor-name:--value]:before:absolute primer:supports-[anchor-name:--value]:before:[position-anchor:--segmented-control-current-item] primer:supports-[anchor-name:--value]:before:[inset:anchor(top)_anchor(right)_anchor(bottom)_anchor(left)] primer:supports-[anchor-name:--value]:before:[display:var(--segmented-control-knob-display,block)] primer:supports-[anchor-name:--value]:before:rounded-[var(--segmented-control-outer-radius)] primer:supports-[anchor-name:--value]:before:border-thin primer:supports-[anchor-name:--value]:before:border-[color:var(--controlKnob-borderColor-rest)] primer:supports-[anchor-name:--value]:before:bg-[var(--controlKnob-bgColor-rest)]',
  'primer:supports-[anchor-name:--value]:motion-safe:before:[transition:inset_var(--base-duration-200)_var(--base-easing-easeInOut)] primer:supports-[anchor-name:--value]:data-[disable-knob-transition]:before:[transition:none]',
)

interface SegmentedControlContextValue {
  registerButton: (value: string, button: HTMLButtonElement | null) => void
  size: SegmentedControlSize
}

const SegmentedControlContext = React.createContext<SegmentedControlContextValue>({
  registerButton: () => {},
  size: 'medium',
})

const SegmentedControlActionContext = React.createContext<'inline' | 'menu'>('inline')

function getButtonLabel(child: React.ReactElement<SegmentedControlButtonProps | SegmentedControlIconButtonProps>) {
  const {children} = child.props as SegmentedControlButtonProps
  return child.type === IconButton || typeof children !== 'string' ? child.props['aria-label'] : children
}

function getButtonVisual(child: React.ReactElement<SegmentedControlButtonProps | SegmentedControlIconButtonProps>) {
  if (child.type === IconButton) return renderIcon((child.props as SegmentedControlIconButtonProps).icon)
  const {leadingVisual} = child.props as SegmentedControlButtonProps
  return leadingVisual ? renderIcon(leadingVisual) : undefined
}

function isSegment(
  child: React.ReactNode,
): child is React.ReactElement<SegmentedControlButtonProps | SegmentedControlIconButtonProps> {
  return React.isValidElement(child) && (child.type === Button || child.type === IconButton)
}

const Root = React.forwardRef<HTMLDivElement, SegmentedControlProps>(function Root(
  {
    action: actionProp,
    'aria-describedby': ariaDescribedBy,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    children,
    className,
    defaultValue = emptyValues,
    fullWidth,
    onKeyDown,
    onValueChange,
    size = 'medium',
    value,
    variant = 'default',
    ...rest
  },
  ref,
) {
  const {
    regions: {action},
    rest: segmentChildren,
  } = resolveRegions(
    children,
    {
      action: {match: isPartOf(Action)},
    },
    {action: actionProp},
  )
  const [uncontrolledValue, setUncontrolledValue] = React.useState<readonly string[]>(defaultValue)
  const selectedValues = value ?? uncontrolledValue
  const buttons = segmentChildren.filter(isSegment)
  const selectedButton = buttons.find(button => button.props.value === selectedValues[0]) ?? buttons.at(0)
  const buttonElements = React.useRef(new Map<string, HTMLButtonElement>())
  const rootRef = React.useRef<HTMLDivElement>(null)
  const segmentCount = buttons.length
  const previousSegmentCount = React.useRef(segmentCount)

  // Adding or removing segments moves the selected item, so the knob jumps instead of sliding to its new position.
  React.useLayoutEffect(() => {
    if (previousSegmentCount.current === segmentCount) return
    previousSegmentCount.current = segmentCount
    const root = rootRef.current
    root?.setAttribute('data-disable-knob-transition', '')
    const frame = requestAnimationFrame(() => root?.removeAttribute('data-disable-knob-transition'))
    return () => cancelAnimationFrame(frame)
  }, [segmentCount])

  const registerButton = (buttonValue: string, button: HTMLButtonElement | null) => {
    if (button) buttonElements.current.set(buttonValue, button)
    else buttonElements.current.delete(buttonValue)
  }
  const handleValueChange: ToggleGroup.Props<string>['onValueChange'] = (nextValue, eventDetails) => {
    if (value === undefined) setUncontrolledValue(nextValue)
    onValueChange?.(nextValue, eventDetails)
  }

  const ranges = resolveRanges(variant, fullWidth)
  const hasDropdown = ranges.some(({variant: rangeVariant}) => rangeVariant === 'dropdown')
  const grouped = hasDropdown || Boolean(action)
  const classes = cn(
    'primer:relative primer:m-0 primer:max-w-full primer:rounded-md primer:border-[color:var(--controlTrack-borderColor-rest,transparent)] primer:p-0',
    size === 'small'
      ? 'primer:h-7 primer:text-[length:var(--text-body-size-small)]'
      : 'primer:h-8 primer:text-[length:var(--text-body-size-medium)]',
    knobClassName,
    grouped && 'primer:min-w-0',
    ranges.map(({range, variant: rangeVariant, fullWidth: rangeFullWidth}) => {
      const layout = layoutClasses[range]
      return [
        variantClasses[range][rangeVariant === 'subtle' ? 'subtle' : 'default'],
        rangeVariant === 'dropdown'
          ? layout.hidden
          : rangeFullWidth
            ? layout.fullWidth
            : rangeFullWidth === false || range !== 'narrow'
              ? layout.inlineAuto
              : layout.inline,
        rangeVariant === 'hideLabels' ? layout.hideLabels : layout.showLabels,
        grouped && (rangeFullWidth ? layout.groupedFullWidth : layout.groupedInline),
      ]
    }),
  )

  const control = (
    <ToggleGroup
      {...rest}
      ref={mergeRefs(ref, rootRef)}
      aria-describedby={ariaDescribedBy}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={mergeClassName(classes, className)}
      data-component="SegmentedControl"
      data-size={size}
      onKeyDown={event => {
        onKeyDown?.(event)
        if (rovingKeys.has(event.key)) event.preventBaseUIHandler()
      }}
      onValueChange={handleValueChange}
      value={selectedValues}
    >
      {segmentChildren}
    </ToggleGroup>
  )

  if (!grouped) {
    return <SegmentedControlContext.Provider value={{registerButton, size}}>{control}</SegmentedControlContext.Provider>
  }

  const selectedLabel = selectedButton ? getButtonLabel(selectedButton) : undefined
  const selectedVisual = selectedButton ? getButtonVisual(selectedButton) : undefined
  return (
    <SegmentedControlContext.Provider value={{registerButton, size}}>
      <div
        className={cn(
          'primer:inline-flex primer:items-center primer:gap-1',
          ranges.map(({range, fullWidth: rangeFullWidth}) =>
            rangeFullWidth
              ? layoutClasses[range].groupFullWidth
              : rangeFullWidth === false
                ? layoutClasses[range].groupInline
                : undefined,
          ),
        )}
        data-size={size}
      >
        {hasDropdown ? (
          <div
            className={cn(
              ranges.map(({range, variant: rangeVariant}) =>
                rangeVariant === 'dropdown' ? layoutClasses[range].dropdownShown : layoutClasses[range].dropdownHidden,
              ),
            )}
            data-component="SegmentedControl.Dropdown"
          >
            <ActionMenu>
              <ActionMenu.Button
                aria-describedby={ariaDescribedBy}
                aria-label={ariaLabel && `${selectedLabel}, ${ariaLabel}`}
                aria-labelledby={ariaLabelledBy}
                className="primer:[&>svg:last-child]:-mr-1"
                leadingVisual={
                  selectedVisual ? <span className="primer:flex primer:text-muted">{selectedVisual}</span> : undefined
                }
              >
                {selectedLabel}
              </ActionMenu.Button>
              <ActionMenu.Content aria-labelledby={ariaLabelledBy}>
                {segmentChildren.map(child => {
                  if (React.isValidElement<SegmentedControlDividerProps>(child) && child.type === Divider) {
                    return (
                      <ActionMenu.Divider key={child.key} className={child.props.className} style={child.props.style} />
                    )
                  }
                  if (!isSegment(child)) return null
                  const buttonValue = child.props.value
                  const selected = selectedValues.includes(buttonValue)
                  const visual = getButtonVisual(child)
                  return (
                    <ActionMenu.Item
                      key={child.key}
                      aria-checked={selected}
                      disabled={child.props.disabled}
                      onClick={() => buttonElements.current.get(buttonValue)?.click()}
                      role="menuitemradio"
                      selected={selected}
                    >
                      {visual ? <ActionMenu.LeadingVisual>{visual}</ActionMenu.LeadingVisual> : null}
                      {getButtonLabel(child)}
                    </ActionMenu.Item>
                  )
                })}
                {action ? (
                  <SegmentedControlActionContext.Provider value="menu">{action}</SegmentedControlActionContext.Provider>
                ) : null}
              </ActionMenu.Content>
            </ActionMenu>
          </div>
        ) : null}
        {control}
        {action ? (
          <div
            className={cn(
              ranges.map(({range, variant: rangeVariant}) =>
                rangeVariant === 'dropdown' ? layoutClasses[range].actionHidden : layoutClasses[range].actionShown,
              ),
            )}
          >
            <SegmentedControlActionContext.Provider value="inline">{action}</SegmentedControlActionContext.Provider>
          </div>
        ) : null}
      </div>
    </SegmentedControlContext.Provider>
  )
})

const buttonClassName = cn(
  'primer:relative primer:-my-px primer:block primer:h-[calc(100%+2px)] primer:grow primer:cursor-pointer primer:appearance-none primer:rounded-[var(--segmented-control-outer-radius)] primer:border-0 primer:bg-transparent primer:p-0 primer:[font-family:inherit] primer:text-[length:inherit] primer:font-normal primer:text-[color:var(--segmented-control-button-fgColor,currentColor)] primer:first:-ml-px primer:last:-mr-px primer:[&:not(:last-child)]:mr-px',
  'primer:data-[pressed]:font-semibold primer:data-[pressed]:text-[color:var(--segmented-control-button-pressed-fgColor,currentColor)]',
  "primer:after:absolute primer:after:top-2 primer:after:-right-0.5 primer:after:bottom-2 primer:after:w-px primer:after:bg-[var(--segmented-control-separator-color,var(--borderColor-default))] primer:last:after:hidden primer:data-[pressed]:after:bg-transparent primer:[&:has(+[data-pressed])]:after:bg-transparent primer:[&:has(+[data-component='SegmentedControl.Divider']+[data-pressed])]:after:bg-transparent",
  'primer:hover:[&:not([data-pressed]):not([data-disabled])>.segmentedControl-content]:bg-[var(--segmented-control-button-bgColor-hover,var(--controlTrack-bgColor-hover))] primer:active:[&:not([data-pressed]):not([data-disabled])>.segmentedControl-content]:bg-[var(--controlTrack-bgColor-active)]',
  'primer:[&_svg]:text-muted primer:[&[data-disabled]:not([data-pressed])]:cursor-not-allowed primer:[&[data-disabled]:not([data-pressed])]:text-disabled primer:[&[data-disabled]:not([data-pressed])_svg]:text-disabled',
  'primer:focus-visible:z-1 primer:focus-visible:outline-2 primer:focus-visible:outline-offset-[-1px] primer:focus-visible:outline-[var(--fgColor-accent)] primer:focus-visible:shadow-none primer:focus-visible:not-last:after:w-0',
  coarsePointerTouchTarget,
)

// Upstream derives the inner radius from a fixed 4px inset, so subtle segments get a 10px radius.
const contentClassName = cn(
  'segmentedControl-content primer:m-[var(--segmented-control-button-bg-inset)] primer:grid primer:h-[calc(100%_-_2*var(--segmented-control-button-bg-inset))] primer:grid-cols-[auto_minmax(0,max-content)_auto] primer:items-center primer:justify-center primer:rounded-[calc(var(--segmented-control-outer-radius)_-_var(--base-size-4)_/_2)] primer:border-[length:var(--segmented-control-content-border-width,var(--borderWidth-thin))] primer:border-solid primer:border-transparent primer:px-[var(--segmented-control-content-padding,var(--base-size-8))] primer:motion-safe:[transition:background-color_var(--base-duration-200)_var(--base-easing-easeInOut)]',
  'primer:[[data-pressed]>&]:m-0 primer:[[data-pressed]>&]:h-full primer:[[data-pressed]>&]:bg-[var(--segmented-control-pressed-content-bg,transparent)] primer:[[data-pressed]>&]:px-3 primer:[[data-pressed]>&]:[anchor-name:--segmented-control-current-item]',
  'primer:not-supports-[anchor-name:--value]:[[data-pressed]>&]:rounded-[var(--segmented-control-outer-radius)] primer:not-supports-[anchor-name:--value]:[[data-pressed]>&]:border-[color:var(--controlKnob-borderColor-rest)] primer:not-supports-[anchor-name:--value]:[[data-pressed]>&]:bg-[var(--segmented-control-pressed-content-bg,var(--controlKnob-bgColor-rest))]',
)

function subscribeToResize(element: Element | null, onChange: () => void) {
  if (!element || typeof ResizeObserver === 'undefined') return () => {}
  const observer = new ResizeObserver(onChange)
  observer.observe(element)
  return () => observer.disconnect()
}

export interface SegmentedControlButtonProps<Value extends string = string>
  extends Omit<Toggle.Props<Value>, 'className' | 'children' | 'data-component' | 'render' | 'value'> {
  className?: Toggle.Props<Value>['className']
  /** Visible label. It stays on one line and truncates with a tooltip when the segment is too narrow. */
  children?: React.ReactNode
  /** Icon shown before the segment's label: a component such as an Octicon, or a rendered element. */
  leadingVisual?: IconSource
  /** Number shown after the segment's label. */
  count?: number | string
  /** Value this segment selects, matched against the control's value. */
  value: Value
}

// Primer's segmented control is a list of buttons, not a toolbar: every segment is a Tab stop and the arrow keys
// neither move focus nor change selection, so the toggle group's roving focus is turned off.
const rovingKeys = new Set(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'])

// Base UI's grouped Toggle sets both `disabled` and `aria-disabled`; the native attribute already conveys the state.
// Its roving `tabIndex` is replaced so every segment stays in the Tab order; disabled buttons are skipped natively.
function renderToggleButton({'aria-disabled': ariaDisabled, ...props}: React.ComponentPropsWithRef<'button'>) {
  return (
    <button
      type="button"
      {...props}
      aria-disabled={props.disabled ? undefined : ariaDisabled}
      tabIndex={props.disabled ? -1 : 0}
    />
  )
}

const Button = React.forwardRef<HTMLButtonElement, SegmentedControlButtonProps>(function Button(
  {
    'aria-describedby': describedBy,
    'aria-labelledby': labelledBy,
    children,
    className,
    count,
    id,
    leadingVisual,
    value,
    ...rest
  },
  ref,
) {
  const {registerButton} = React.useContext(SegmentedControlContext)
  const [label, setLabel] = React.useState<HTMLSpanElement | null>(null)
  const isTruncated = React.useSyncExternalStore(
    onChange => subscribeToResize(label, onChange),
    () => label !== null && label.scrollWidth > label.clientWidth,
    () => false,
  )

  return (
    <Tooltip.Root disabled={!isTruncated} type="label">
      {/* Render-element props override the trigger's, so `id` and ARIA references go through the trigger. */}
      <Tooltip.Trigger
        id={id}
        aria-describedby={describedBy}
        aria-labelledby={labelledBy}
        render={
          <Toggle
            {...rest}
            ref={mergeRefs(ref, button => registerButton(value, button))}
            className={mergeClassName(buttonClassName, className)}
            data-component="SegmentedControl.Button"
            render={renderToggleButton}
            value={value}
          >
            <span className={contentClassName}>
              {leadingVisual ? (
                <span className="primer:col-start-1 primer:mr-1">{renderIcon(leadingVisual)}</span>
              ) : null}
              <span
                ref={setLabel}
                className="segmentedControl-text primer:col-start-2 primer:min-w-0 primer:truncate primer:after:pointer-events-none primer:after:invisible primer:after:block primer:after:h-0 primer:after:overflow-hidden primer:after:font-semibold primer:after:select-none primer:after:content-[attr(data-text)]"
                data-text={typeof children === 'string' ? children : undefined}
              >
                {children}
              </span>
              {count !== undefined && (
                <span className="primer:col-start-3 primer:ms-2 primer:flex primer:items-center">
                  <CounterLabel>{count}</CounterLabel>
                </span>
              )}
            </span>
          </Toggle>
        }
      />
      <Tooltip.Content side="bottom">{children}</Tooltip.Content>
    </Tooltip.Root>
  )
})

export interface SegmentedControlIconButtonProps<Value extends string = string>
  extends Omit<SegmentedControlButtonProps<Value>, 'children' | 'leadingVisual'> {
  /** Accessible name for the segment, since the icon alone conveys nothing. Shown in the tooltip by default. */
  'aria-label': string
  /** Icon to render: a component such as an Octicon, or a rendered element. */
  icon: IconSource
  /** Supplementary text shown in the tooltip instead of the label and exposed as the accessible description. */
  description?: string
  /**
   * Side and alignment of the tooltip relative to the segment.
   * @default 's'
   */
  tooltipDirection?: TooltipDirection
}

const IconButton = React.forwardRef<HTMLButtonElement, SegmentedControlIconButtonProps>(function IconButton(
  {
    'aria-describedby': describedBy,
    'aria-label': ariaLabel,
    'aria-labelledby': labelledBy,
    className,
    count,
    description,
    icon,
    id,
    tooltipDirection = 's',
    value,
    ...rest
  },
  ref,
) {
  const {registerButton} = React.useContext(SegmentedControlContext)
  const placement = tooltipDirectionPlacement[tooltipDirection]

  return (
    <Tooltip.Root type={description ? 'description' : 'label'}>
      <Tooltip.Trigger
        id={id}
        aria-describedby={describedBy}
        aria-labelledby={labelledBy}
        render={
          <Toggle
            {...rest}
            ref={mergeRefs(ref, button => registerButton(value, button))}
            aria-label={ariaLabel}
            className={mergeClassName(
              cn(
                buttonClassName,
                count === undefined
                  ? 'primer:w-[var(--segmented-control-icon-width,var(--control-medium-size))]'
                  : 'primer:min-w-[var(--segmented-control-icon-width,var(--control-medium-size))]',
              ),
              className,
            )}
            data-component="SegmentedControl.IconButton"
            render={renderToggleButton}
            value={value}
          >
            <span className={contentClassName}>
              {renderIcon(icon)}
              {count !== undefined && (
                <span className="primer:col-start-3 primer:ms-2 primer:flex primer:items-center">
                  <CounterLabel>{count}</CounterLabel>
                </span>
              )}
            </span>
          </Toggle>
        }
      />
      <Tooltip.Content align={placement.align} side={placement.side}>
        {description || ariaLabel}
      </Tooltip.Content>
    </Tooltip.Root>
  )
})

export interface SegmentedControlDividerProps {
  /** Additional classes for the divider. */
  className?: string
  /** Inline styles for the divider. */
  style?: React.CSSProperties
}

/** Visual separator between groups of segments. Only visible in the `subtle` variant and in the dropdown menu. */
const Divider = React.forwardRef<HTMLDivElement, SegmentedControlDividerProps>(function Divider(
  {className, style},
  ref,
) {
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(
        'primer:my-2 primer:ms-2 primer:me-[calc(var(--base-size-8)-1px)] primer:w-px primer:self-stretch primer:bg-[var(--borderColor-default)] primer:[display:var(--segmented-control-divider-display,none)]',
        className,
      )}
      data-component="SegmentedControl.Divider"
      style={style}
    />
  )
})

export interface SegmentedControlActionProps {
  /** Accessible name of the action, shown in its tooltip and as the menu item text in the dropdown variant. */
  label: string
  /** Icon component for the action. */
  icon: React.ElementType
  /** Called when the action is activated. */
  onClick?: () => void
  /** Prevents the action from being activated. */
  disabled?: boolean
  /** Shows a spinner and suppresses activation. */
  loading?: boolean
}

/**
 * Trailing action, such as adding a view. Renders as an invisible icon button beside the segments, and as the last item
 * of the menu when the control collapses into a dropdown.
 */
function Action({disabled, icon: Icon, label, loading, onClick}: SegmentedControlActionProps) {
  const placement = React.useContext(SegmentedControlActionContext)
  const {size} = React.useContext(SegmentedControlContext)

  if (placement === 'menu') {
    return (
      <>
        <ActionMenu.Divider />
        {/* `selected={false}` reserves the check column so the action aligns with the single-select segments. */}
        <ActionMenu.Item
          closeOnClick={false}
          disabled={disabled}
          loading={loading}
          onClick={() => onClick?.()}
          selected={false}
        >
          <ActionMenu.LeadingVisual>
            <Icon aria-hidden="true" />
          </ActionMenu.LeadingVisual>
          {label}
        </ActionMenu.Item>
      </>
    )
  }

  return (
    <div className="primer:flex primer:items-center" data-component="SegmentedControl.Action">
      <PrimerIconButton
        aria-label={label}
        disabled={disabled}
        icon={Icon}
        loading={loading}
        onClick={() => onClick?.()}
        size={size === 'small' ? 'small' : 'medium'}
        variant="invisible"
      />
    </div>
  )
}

/**
 * A single-choice Base UI toggle group. Compose Button, IconButton, and Divider children in author order, and an
 * optional trailing Action.
 */
export const SegmentedControl = Object.assign(Root, {Button, IconButton, Divider, Action})
