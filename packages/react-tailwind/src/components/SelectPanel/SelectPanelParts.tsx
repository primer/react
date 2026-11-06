'use client'

import {Combobox} from '@base-ui/react/combobox'
import {Select} from '@base-ui/react/select'
import type {ComponentRenderFn, HTMLProps} from '@base-ui/react/types'
import React from 'react'
import {cn} from '../../internal/cn'
import {mergeClassName} from '../../internal/mergeClassName'
import {usePortalContainer} from '../../internal/portalRoot'
import {SelectionVisual, type SelectionVisualVariant} from '../../internal/selectionVisuals'
import {Button} from '../Button'
import {TextInput} from '../TextInput'
import {Spinner} from '../Spinner'
import {actionItemPartClassName, getActionItemStateClassName} from '../ActionList/itemState'

interface PartsContextValue {
  filterable: boolean
  multiple: boolean
  titleId: string
}

const PartsContext = React.createContext<PartsContextValue | null>(null)

function useParts() {
  const context = React.useContext(PartsContext)
  if (!context) throw new Error('SelectPanel parts must be inside SelectPanel.Root')
  return context
}

export type SelectPanelRootProps<Value, Multiple extends boolean | undefined = false> =
  | (Combobox.Root.Props<Value, Multiple> & {
      /** Use Combobox behavior with an optional filter input. Defaults to true. */
      filterable?: true
    })
  | (Select.Root.Props<Value, Multiple> & {
      /** Use Select behavior for a picker without an input. */
      filterable: false
    })

export function Root<Value, Multiple extends boolean | undefined = false>(
  props: SelectPanelRootProps<Value, Multiple>,
) {
  const titleId = React.useId()
  return (
    <PartsContext.Provider value={{filterable: props.filterable !== false, multiple: Boolean(props.multiple), titleId}}>
      {props.filterable === false ? <SelectRoot {...props} /> : <ComboboxRoot {...props} />}
    </PartsContext.Provider>
  )
}

function SelectRoot<Value, Multiple extends boolean | undefined = false>({
  filterable: _filterable,
  ...props
}: Select.Root.Props<Value, Multiple> & {filterable: false}) {
  return <Select.Root {...props} />
}

function ComboboxRoot<Value, Multiple extends boolean | undefined = false>({
  filterable: _filterable,
  ...props
}: Combobox.Root.Props<Value, Multiple> & {filterable?: true}) {
  return <Combobox.Root {...props} />
}

type SharedStateProps<Props, State> = Omit<Props, 'className' | 'style' | 'render'> & {
  /** Classes or a state-aware class resolver for either behavior family. */
  className?: string | ((state: State) => string | undefined)
  /** Styles or a state-aware style resolver for either behavior family. */
  style?: React.CSSProperties | ((state: State) => React.CSSProperties | undefined)
  /** Replaces the rendered element while retaining primitive behavior. */
  render?: React.ReactElement | ComponentRenderFn<HTMLProps, State>
}

export interface SelectPanelTriggerProps
  extends SharedStateProps<Combobox.Trigger.Props, Combobox.Trigger.State | Select.Trigger.State> {
  /**
   * Replaces the trigger element while retaining primitive behavior.
   * @default <Button />
   */
  render?: React.ReactElement | ComponentRenderFn<HTMLProps, Combobox.Trigger.State | Select.Trigger.State>
}

const defaultTrigger = <Button />

export function Trigger({render = defaultTrigger, ...props}: SelectPanelTriggerProps) {
  const {filterable} = useParts()
  return filterable ? (
    <Combobox.Trigger {...props} render={render} data-component="SelectPanel.Trigger" />
  ) : (
    <Select.Trigger {...props} render={render} data-component="SelectPanel.Trigger" />
  )
}

export type SelectPanelPortalProps = Combobox.Portal.Props

export function Portal({container, ...props}: SelectPanelPortalProps) {
  const {filterable} = useParts()
  const portalContainer = usePortalContainer(container)
  const Part = filterable ? Combobox.Portal : Select.Portal
  return <Part {...props} container={portalContainer} />
}

export type SelectPanelPositionerProps = SharedStateProps<
  Combobox.Positioner.Props,
  Combobox.Positioner.State | Select.Positioner.State
>

export function Positioner({className, align = 'start', sideOffset = 4, ...props}: SelectPanelPositionerProps) {
  const {filterable} = useParts()
  return filterable ? (
    <Combobox.Positioner
      {...props}
      align={align}
      sideOffset={sideOffset}
      className={mergeClassName('z-popover', className)}
      data-component="SelectPanel.Positioner"
    />
  ) : (
    <Select.Positioner
      {...props}
      align={align}
      sideOffset={sideOffset}
      alignItemWithTrigger={false}
      className={mergeClassName('z-popover', className)}
      data-component="SelectPanel.Positioner"
    />
  )
}

export type SelectPanelPopupProps = SharedStateProps<Combobox.Popup.Props, Combobox.Popup.State | Select.Popup.State>

const surfaceClassName =
  'flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border border-default bg-default text-default shadow-floating-lg'

export function Popup({className, ...props}: SelectPanelPopupProps) {
  const {filterable, titleId} = useParts()
  const labelledBy = props['aria-label'] ? undefined : titleId
  const popupClasses = mergeClassName(
    cn(surfaceClassName, 'w-80 max-h-[var(--available-height)] outline-none'),
    className,
  )
  return filterable ? (
    <Combobox.Popup
      aria-labelledby={labelledBy}
      {...props}
      className={popupClasses}
      data-component="SelectPanel.Popup"
    />
  ) : (
    <Select.Popup aria-labelledby={labelledBy} {...props} className={popupClasses} data-component="SelectPanel.Popup" />
  )
}

export interface SelectPanelSurfaceProps extends React.ComponentPropsWithRef<'div'> {
  /** Omit the floating surface decoration inside an existing dialog. */
  undecorated?: boolean
}

/** Presentational surface for embedding a picker inside a Popover or Dialog owned by the caller. */
export function Surface({className, undecorated = false, ...props}: SelectPanelSurfaceProps) {
  return (
    <div
      {...props}
      className={cn(
        'flex min-h-0 flex-1 flex-col overflow-hidden bg-default text-default',
        !undecorated && surfaceClassName,
        className,
      )}
      data-component="SelectPanel"
    />
  )
}

export type SelectPanelHeaderProps = React.ComponentPropsWithRef<'header'>
export function Header({className, ...props}: SelectPanelHeaderProps) {
  return (
    <header
      {...props}
      className={cn('flex items-start justify-between gap-4 px-4 pt-4', className)}
      data-component="SelectPanel.Header"
    />
  )
}

export type SelectPanelTitleProps = React.ComponentPropsWithRef<'h2'>
export function Title({className, id, children, ...props}: SelectPanelTitleProps) {
  const {titleId} = useParts()
  return (
    <h2
      {...props}
      id={id ?? titleId}
      className={cn('m-0 font-semibold text-default', className)}
      data-component="SelectPanel.Title"
    >
      {children}
    </h2>
  )
}

export interface SelectPanelFilterProps extends Combobox.Input.Props {
  /**
   * Replaces the filter element while retaining input behavior.
   * @default <TextInput block />
   */
  render?: Combobox.Input.Props['render']
}
const defaultFilter = <TextInput block className="w-full" />

export function Filter({render = defaultFilter, ...props}: SelectPanelFilterProps) {
  const {filterable} = useParts()
  if (!filterable) throw new Error('SelectPanel.Filter requires a filterable SelectPanel.Root')
  return <Combobox.Input {...props} render={render} data-component="SelectPanel.Filter" />
}

export type SelectPanelListPartProps = SharedStateProps<Combobox.List.Props, Combobox.List.State | Select.List.State>
export function List({className, children, ...props}: SelectPanelListPartProps) {
  const {filterable} = useParts()
  const classes = mergeClassName('m-0 min-h-0 max-h-72 flex-1 list-none overflow-auto p-1', className)
  if (filterable) {
    return (
      <Combobox.List {...props} className={classes} data-component="SelectPanel.List">
        {children}
      </Combobox.List>
    )
  }
  if (typeof children === 'function') throw new Error('Non-filterable SelectPanel.List requires explicit Item children')
  return (
    <Select.List {...props} className={classes} data-component="SelectPanel.List">
      {children}
    </Select.List>
  )
}

export interface SelectPanelItemPartProps extends Combobox.Item.Props {
  /** Text used for typeahead in a non-filterable picker. */
  label?: string
}
export function Item({className, disabled, label, ...props}: SelectPanelItemPartProps) {
  const {filterable} = useParts()
  const classes = mergeClassName(
    cn(
      'group relative flex w-full cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm leading-5 outline-none',
      actionItemPartClassName.content,
      getActionItemStateClassName({disabled, highlightable: true}),
    ),
    className,
  )
  return filterable ? (
    <Combobox.Item {...props} disabled={disabled} className={classes} data-component="SelectPanel.Item" />
  ) : (
    <Select.Item {...props} label={label} disabled={disabled} className={classes} data-component="SelectPanel.Item" />
  )
}

export type SelectPanelGroupProps = Combobox.Group.Props
export function Group({className, ...props}: SelectPanelGroupProps) {
  const {filterable} = useParts()
  return filterable ? (
    <Combobox.Group
      {...props}
      className={mergeClassName('block pb-2 last:pb-0', className)}
      data-component="SelectPanel.Group"
    />
  ) : (
    <Select.Group
      {...props}
      className={mergeClassName('block pb-2 last:pb-0', className)}
      data-component="SelectPanel.Group"
    />
  )
}

export interface SelectPanelGroupLabelProps extends Combobox.GroupLabel.Props {
  /** Filled labels draw a background and dividing border. */
  variant?: 'subtle' | 'filled'
}
export function GroupLabel({className, variant, ...props}: SelectPanelGroupLabelProps) {
  const {filterable} = useParts()
  const classes = mergeClassName(
    cn(
      'flex min-h-[30px] items-center px-3 py-1.5 text-xs leading-[18px] font-semibold text-muted',
      variant === 'filled' && 'mb-1 border-y border-muted bg-muted',
    ),
    className,
  )
  const Part = filterable ? Combobox.GroupLabel : Select.GroupLabel
  return <Part {...props} className={classes} data-component="SelectPanel.GroupHeading" />
}

export type SelectPanelEmptyProps = Combobox.Empty.Props
export function Empty({className, ...props}: SelectPanelEmptyProps) {
  const {filterable} = useParts()
  if (!filterable) throw new Error('SelectPanel.Empty requires a filterable SelectPanel.Root')
  return (
    <Combobox.Empty
      {...props}
      className={mergeClassName('flex flex-1', className)}
      data-component="SelectPanel.Empty"
    />
  )
}

export interface SelectPanelLoadingProps extends React.ComponentPropsWithRef<'div'> {
  /** Which affordance to show while waiting for options. */
  variant?: 'spinner' | 'skeleton'
}
export function Loading({children = 'Loading', className, variant = 'spinner', ...props}: SelectPanelLoadingProps) {
  return (
    <div
      {...props}
      className={cn('flex flex-1 items-center justify-center gap-2 p-6 text-sm text-muted', className)}
      data-component="SelectPanel.Loading"
      role="status"
    >
      {variant === 'skeleton' ? (
        <div aria-hidden="true" className="w-full space-y-2">
          <div className="h-4 animate-pulse rounded bg-neutral-muted" />
          <div className="h-4 w-4/5 animate-pulse rounded bg-neutral-muted" />
          <div className="h-4 w-3/5 animate-pulse rounded bg-neutral-muted" />
        </div>
      ) : (
        <Spinner size="small" srText={null} />
      )}
      {children}
    </div>
  )
}

export type SelectPanelFooterProps = React.ComponentPropsWithRef<'footer'>
export function Footer({className, ...props}: SelectPanelFooterProps) {
  return (
    <footer
      {...props}
      className={cn('flex flex-wrap items-center gap-2 border-t border-default p-3', className)}
      data-component="SelectPanel.Footer"
    />
  )
}

export interface SelectPanelSelectionIndicatorProps extends Omit<React.ComponentPropsWithRef<'span'>, 'children'> {
  /** Overrides the default single checkmark or multiple checkbox appearance. */
  variant?: SelectionVisualVariant
  /** Draws disabled selection colors. */
  disabled?: boolean
}
export function SelectionIndicator({variant, disabled, ...props}: SelectPanelSelectionIndicatorProps) {
  const {filterable, multiple} = useParts()
  const Part = filterable ? Combobox.ItemIndicator : Select.ItemIndicator
  return (
    <Part
      keepMounted
      render={({children: _children, ...indicatorProps}, state) => (
        <SelectionVisual
          {...indicatorProps}
          {...props}
          checked={state.selected}
          disabled={disabled}
          variant={variant ?? (multiple ? 'multiple' : 'single')}
        />
      )}
    />
  )
}

export const Collection = Combobox.Collection
