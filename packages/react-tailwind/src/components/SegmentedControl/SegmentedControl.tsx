'use client'

import {ToggleGroup} from '@base-ui/react/toggle-group'
import {Toggle} from '@base-ui/react/toggle'
import {CheckIcon} from '@primer/octicons-react'
import React from 'react'
import {flattenChildren} from '../../internal/children'
import {cn} from '../../internal/cn'
import type {ResponsiveValue} from '../../utils/types'
import {ActionMenu} from '../ActionMenu'
import {CounterLabel} from '../CounterLabel'

export type SegmentedControlSize = 'small' | 'medium'
export type SegmentedControlVariant = 'default' | 'hideLabels' | 'dropdown'

type ResponsiveSegmentedControlVariant = Partial<Record<'narrow' | 'regular' | 'wide', SegmentedControlVariant>>
const emptyValues: readonly string[] = []

export interface SegmentedControlProps<Value extends string = string>
  extends Omit<ToggleGroup.Props<Value>, 'className' | 'data-component' | 'multiple'> {
  className?: ToggleGroup.Props<Value>['className']
  /** Stretches the control to fill its container, sharing the width between segments. */
  fullWidth?: ResponsiveValue<boolean>
  /** Height and text size of the segments. */
  size?: SegmentedControlSize
  /** How the control adapts on narrow viewports, such as collapsing into a menu or hiding labels. */
  variant?: 'default' | ResponsiveSegmentedControlVariant
}

function fullWidthAtRange(value: ResponsiveValue<boolean> | undefined, range: 'narrow' | 'regular' | 'wide') {
  return typeof value === 'object' ? value[range] : value
}

function fullWidthClasses(value: ResponsiveValue<boolean> | undefined) {
  if (value === undefined) {
    return 'inline-flex [&>[data-component="SegmentedControl.Button"]]:grow'
  }

  if (typeof value === 'boolean') {
    return value ? 'flex w-full [&>[data-component="SegmentedControl.Button"]]:grow' : 'inline-flex w-auto'
  }

  return [
    value.narrow
      ? 'flex w-full [&>[data-component="SegmentedControl.Button"]]:grow'
      : 'inline-flex w-auto [&>[data-component="SegmentedControl.Button"]]:grow',
    value.regular
      ? 'md:flex md:w-full md:[&>[data-component="SegmentedControl.Button"]]:grow'
      : 'md:inline-flex md:w-auto md:[&>[data-component="SegmentedControl.Button"]]:grow',
    value.wide
      ? '2xl:flex 2xl:w-full 2xl:[&>[data-component="SegmentedControl.Button"]]:grow'
      : '2xl:inline-flex 2xl:w-auto 2xl:[&>[data-component="SegmentedControl.Button"]]:grow',
  ]
}

function variantClasses(
  variant: SegmentedControlProps['variant'],
  fullWidth: ResponsiveValue<boolean> | undefined,
  target: 'control' | 'dropdown',
) {
  const values = typeof variant === 'object' ? variant : {}
  const variants = {
    narrow: values.narrow ?? 'default',
    regular: values.regular ?? 'default',
    wide: values.wide ?? 'default',
  }

  if (target === 'dropdown') {
    return [
      variants.narrow === 'dropdown' ? 'block' : 'hidden',
      variants.regular === 'dropdown' ? 'md:block' : 'md:hidden',
      variants.wide === 'dropdown' ? '2xl:block' : '2xl:hidden',
    ]
  }

  return [
    variants.narrow === 'dropdown' ? 'hidden' : fullWidthAtRange(fullWidth, 'narrow') ? 'flex' : 'inline-flex',
    variants.regular === 'dropdown'
      ? 'md:hidden'
      : fullWidthAtRange(fullWidth, 'regular')
        ? 'md:flex'
        : 'md:inline-flex',
    variants.wide === 'dropdown' ? '2xl:hidden' : fullWidthAtRange(fullWidth, 'wide') ? '2xl:flex' : '2xl:inline-flex',
    variants.narrow === 'hideLabels' && '[&_.segmentedControl-text]:hidden',
    variants.regular === 'hideLabels' ? 'md:[&_.segmentedControl-text]:hidden' : 'md:[&_.segmentedControl-text]:inline',
    variants.wide === 'hideLabels' ? '2xl:[&_.segmentedControl-text]:hidden' : '2xl:[&_.segmentedControl-text]:inline',
  ]
}

interface SegmentedControlContextValue {
  registerButton: (value: string, button: HTMLButtonElement | null) => void
}

const SegmentedControlContext = React.createContext<SegmentedControlContextValue>({
  registerButton: () => {},
})

function getButtonLabel(child: React.ReactElement<SegmentedControlButtonProps>) {
  return typeof child.props.children === 'string' ? child.props.children : child.props['aria-label']
}

function getButtonVisual(child: React.ReactElement<SegmentedControlButtonProps>) {
  if (child.type === IconButton) {
    const Icon = (child.props as SegmentedControlIconButtonProps).icon
    return <Icon aria-hidden="true" />
  }
  return child.props.leadingVisual
}

const Root = React.forwardRef<HTMLDivElement, SegmentedControlProps>(function Root(
  {
    'aria-describedby': ariaDescribedBy,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    children,
    className,
    defaultValue = emptyValues,
    fullWidth,
    onValueChange,
    size = 'medium',
    value,
    variant = 'default',
    ...rest
  },
  ref,
) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState<readonly string[]>(defaultValue)
  const selectedValues = value ?? uncontrolledValue
  const buttons = flattenChildren(children).filter(
    (child): child is React.ReactElement<SegmentedControlButtonProps> =>
      React.isValidElement<SegmentedControlButtonProps>(child) && (child.type === Button || child.type === IconButton),
  )
  const selectedButton = buttons.find(button => button.props.value === selectedValues[0]) ?? buttons.at(0)
  const buttonElements = React.useRef(new Map<string, HTMLButtonElement>())
  const registerButton = React.useCallback((buttonValue: string, button: HTMLButtonElement | null) => {
    if (button) buttonElements.current.set(buttonValue, button)
    else buttonElements.current.delete(buttonValue)
  }, [])
  const handleValueChange: ToggleGroup.Props<string>['onValueChange'] = (nextValue, eventDetails) => {
    if (value === undefined) setUncontrolledValue(nextValue)
    onValueChange?.(nextValue, eventDetails)
  }
  const classes = cn(
    'm-0 rounded-md border border-[var(--controlTrack-borderColor-rest,transparent)] bg-[var(--controlTrack-bgColor-rest)] p-0',
    size === 'small' ? 'h-7 text-xs' : 'h-8 text-sm',
    fullWidthClasses(fullWidth),
    variantClasses(variant, fullWidth, 'control'),
  )
  const mergedClassName =
    typeof className === 'function'
      ? (state: ToggleGroup.State) => cn(classes, className(state))
      : cn(classes, className)

  return (
    <SegmentedControlContext.Provider value={{registerButton}}>
      {typeof variant === 'object' && Object.values(variant).includes('dropdown') ? (
        <div className={cn(variantClasses(variant, fullWidth, 'dropdown'))} data-component="SegmentedControl.Dropdown">
          <ActionMenu>
            <ActionMenu.Button
              aria-describedby={ariaDescribedBy}
              aria-label={ariaLabel}
              aria-labelledby={ariaLabelledBy}
              className="[&>svg:last-child]:-mr-1"
              leadingVisual={
                selectedButton ? <span className="flex text-muted">{getButtonVisual(selectedButton)}</span> : undefined
              }
            >
              {selectedButton ? getButtonLabel(selectedButton) : null}
            </ActionMenu.Button>
            <ActionMenu.Content aria-labelledby={ariaLabelledBy}>
              {buttons.map(button => {
                const buttonValue = button.props.value
                const selected = selectedValues.includes(buttonValue)
                return (
                  <ActionMenu.Item
                    key={buttonValue}
                    aria-checked={selected}
                    disabled={button.props.disabled}
                    onClick={() => buttonElements.current.get(buttonValue)?.click()}
                    role="menuitemradio"
                  >
                    <span className="flex size-4 shrink-0 items-center justify-center">
                      {selected ? <CheckIcon aria-hidden="true" /> : null}
                    </span>
                    {getButtonVisual(button)}
                    {getButtonLabel(button)}
                  </ActionMenu.Item>
                )
              })}
            </ActionMenu.Content>
          </ActionMenu>
        </div>
      ) : null}
      <ToggleGroup
        {...rest}
        ref={ref}
        aria-describedby={ariaDescribedBy}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        className={mergedClassName}
        data-component="SegmentedControl"
        data-size={size}
        onValueChange={handleValueChange}
        value={selectedValues}
      >
        {children}
      </ToggleGroup>
    </SegmentedControlContext.Provider>
  )
})

export interface SegmentedControlButtonProps<Value extends string = string>
  extends Omit<Toggle.Props<Value>, 'className' | 'children' | 'data-component' | 'render' | 'value'> {
  className?: Toggle.Props<Value>['className']
  children?: React.ReactNode
  /** Icon shown before the segment's label. */
  leadingVisual?: React.ReactNode
  /** Number shown after the segment's label. */
  count?: number | string
  /** Value this segment selects, matched against the control's value. */
  value: Value
}

const Button = React.forwardRef<HTMLButtonElement, SegmentedControlButtonProps>(function Button(
  {children, className, count, leadingVisual, value, ...rest},
  ref,
) {
  const {registerButton} = React.useContext(SegmentedControlContext)
  const mergedRef = React.useCallback(
    (button: HTMLButtonElement | null) => {
      registerButton(value, button)
      if (typeof ref === 'function') ref(button)
      else if (ref) ref.current = button
    },
    [ref, registerButton, value],
  )
  const mergedClassName =
    typeof className === 'function'
      ? (state: Toggle.State) =>
          cn(
            'relative -my-px first:-ml-px inline-flex h-[calc(100%+2px)] appearance-none items-center justify-center rounded-md border-0 bg-transparent p-1 text-[length:inherit] font-normal text-default outline-none [font-family:inherit] after:absolute after:inset-y-2 after:-right-px after:w-px after:bg-[var(--borderColor-default)] last:-mr-px last:after:hidden [&:not(:last-child)]:mr-px hover:[&:not([data-pressed])_.segmentedControl-content]:bg-[var(--controlTrack-bgColor-hover)] active:[&:not([data-pressed])_.segmentedControl-content]:bg-[var(--controlTrack-bgColor-active)] data-[pressed]:p-0 data-[pressed]:font-semibold data-[pressed]:after:bg-transparent data-[disabled]:cursor-not-allowed data-[disabled]:after:bg-transparent focus-visible:z-1 focus-visible:outline-2 focus-visible:outline-offset-[-1px] focus-visible:outline-focus [&:has(+_[data-pressed])]:after:bg-transparent [&:has(.segmentedControl-text:empty)]:w-8 [&[data-disabled]:not([data-pressed])]:text-disabled [&[data-disabled]:not([data-pressed])_svg]:text-disabled [&_svg]:text-muted',
            className(state),
          )
      : cn(
          'relative -my-px first:-ml-px inline-flex h-[calc(100%+2px)] appearance-none items-center justify-center rounded-md border-0 bg-transparent p-1 text-[length:inherit] font-normal text-default outline-none [font-family:inherit] after:absolute after:inset-y-2 after:-right-px after:w-px after:bg-[var(--borderColor-default)] last:-mr-px last:after:hidden [&:not(:last-child)]:mr-px hover:[&:not([data-pressed])_.segmentedControl-content]:bg-[var(--controlTrack-bgColor-hover)] active:[&:not([data-pressed])_.segmentedControl-content]:bg-[var(--controlTrack-bgColor-active)] data-[pressed]:p-0 data-[pressed]:font-semibold data-[pressed]:after:bg-transparent data-[disabled]:cursor-not-allowed data-[disabled]:after:bg-transparent focus-visible:z-1 focus-visible:outline-2 focus-visible:outline-offset-[-1px] focus-visible:outline-focus [&:has(+_[data-pressed])]:after:bg-transparent [&:has(.segmentedControl-text:empty)]:w-8 [&[data-disabled]:not([data-pressed])]:text-disabled [&[data-disabled]:not([data-pressed])_svg]:text-disabled [&_svg]:text-muted',
          className,
        )

  return (
    <Toggle
      {...rest}
      ref={mergedRef}
      value={value}
      data-component="SegmentedControl.Button"
      className={mergedClassName}
    >
      <span className="segmentedControl-content flex h-full w-full items-center justify-center rounded-[calc(var(--borderRadius-medium)-2px)] border border-transparent px-2 [[data-component='SegmentedControl.Button']:has(.segmentedControl-text:empty)>&]:px-1 [[data-pressed]>&]:rounded-md [[data-pressed]>&]:border-[var(--controlKnob-borderColor-rest)] [[data-pressed]>&]:bg-[var(--controlKnob-bgColor-rest)] [[data-pressed]>&]:px-3">
        {leadingVisual ? <span className={cn('flex', children !== undefined && 'mr-1')}>{leadingVisual}</span> : null}
        <span
          className="segmentedControl-text empty:hidden after:block after:h-0 after:overflow-hidden after:font-semibold after:invisible after:content-[attr(data-text)]"
          data-text={typeof children === 'string' ? children : undefined}
        >
          {children}
        </span>
        {count !== undefined && (
          <span className="ml-2 flex items-center">
            <CounterLabel>{count}</CounterLabel>
          </span>
        )}
      </span>
    </Toggle>
  )
})

export interface SegmentedControlIconButtonProps<Value extends string = string>
  extends Omit<SegmentedControlButtonProps<Value>, 'children' | 'leadingVisual'> {
  /** Accessible name for the segment, since the icon alone conveys nothing. */
  'aria-label': string
  /** Icon component to render. */
  icon: React.ElementType
}

const IconButton = React.forwardRef<HTMLButtonElement, SegmentedControlIconButtonProps>(function IconButton(
  {icon: Icon, ...rest},
  ref,
) {
  return <Button {...rest} ref={ref} leadingVisual={<Icon aria-hidden="true" />} />
})

/** A single-choice Base UI toggle group. Compose Button and IconButton children in author order. */
export const SegmentedControl = Object.assign(Root, {Button, IconButton})
;('use client')
