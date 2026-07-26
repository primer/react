'use client'

import {CheckIcon, ChevronRightIcon, TriangleDownIcon} from '@primer/octicons-react'
import {Menu} from '@base-ui/react/menu'
import React from 'react'
import {cn} from '../../internal/cn'
import {mergeClassName} from '../../internal/mergeClassName'
import type {FloatingContentProps} from '../../utils/types'
import {ActionItemContent, actionItemClassName, ActionList} from '../ActionList/ActionList'
import {Button, type ButtonProps} from '../Button'
import {Spinner} from '../Spinner'
const triggerClassName =
  'inline-flex min-h-8 items-center justify-center gap-2 rounded-md border border-default bg-default px-3 text-sm font-semibold text-default hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:text-disabled'

const subscribeToPortalContainer = () => () => {}
const getPortalContainer = () => document.querySelector<HTMLElement>('[data-portal-root]') ?? document.body
const getServerPortalContainer = () => null

export type ActionMenuRootProps = Menu.Root.Props

const Root = Menu.Root

export type ActionMenuTriggerProps = Omit<Menu.Trigger.Props, 'data-component'>

const Trigger = React.forwardRef<HTMLButtonElement, ActionMenuTriggerProps>(function ActionMenuTrigger(
  {className, render, ...rest},
  ref,
) {
  return (
    <Menu.Trigger
      data-component="ActionMenu.Trigger"
      {...rest}
      render={render}
      ref={ref}
      className={mergeClassName(render ? '' : triggerClassName, className)}
    />
  )
})

export interface ActionMenuButtonProps extends Omit<ButtonProps, 'data-component' | 'render' | 'trailingVisual'> {
  children?: React.ReactNode
}

const ButtonTrigger = React.forwardRef<HTMLButtonElement, ActionMenuButtonProps>(function ActionMenuButton(
  {children, className, disabled, loading, size = 'medium', ...buttonProps},
  ref,
) {
  return (
    <Menu.Trigger
      disabled={disabled || loading}
      render={
        <Button
          {...buttonProps}
          ref={ref}
          className={cn(size === 'small' ? 'pr-1.5' : size === 'large' ? 'pr-3' : 'pr-2', className)}
          disabled={disabled}
          loading={loading}
          size={size}
          trailingVisual={<TriangleDownIcon aria-hidden="true" />}
          data-component="ActionMenu.Button"
        />
      }
    >
      {children}
    </Menu.Trigger>
  )
})

export interface ActionMenuContentProps
  extends Omit<Menu.Popup.Props, 'data-component'>,
    Omit<FloatingContentProps, 'portal'> {}

const Content = React.forwardRef<HTMLDivElement, ActionMenuContentProps>(function ActionMenuContent(
  {align = 'start', alignOffset, children, className, positionerClassName, side = 'bottom', sideOffset = 4, ...rest},
  ref,
) {
  const portalContainer = React.useSyncExternalStore(
    subscribeToPortalContainer,
    getPortalContainer,
    getServerPortalContainer,
  )

  if (portalContainer === null) return null
  return (
    <Menu.Portal container={portalContainer}>
      <Menu.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className={cn('z-popover', positionerClassName)}
        data-component="ActionMenu.Positioner"
      >
        <Menu.Popup
          {...rest}
          ref={ref}
          className={mergeClassName(
            'min-w-48 rounded-lg bg-[var(--overlay-bgColor)] py-2 shadow-floating-sm outline-none contrast-more:border contrast-more:border-current data-[closed]:hidden',
            className,
          )}
          data-component="ActionMenu.Content"
        >
          {children}
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  )
})

export interface ActionMenuItemProps extends Omit<Menu.Item.Props, 'data-component'> {
  inactiveText?: React.ReactNode
  loading?: boolean
  loadingText?: string
  selected?: boolean
  variant?: 'default' | 'danger'
}

const Item = React.forwardRef<HTMLElement, ActionMenuItemProps>(function ActionMenuItem(
  {children, className, disabled, inactiveText, loading = false, loadingText, selected, variant = 'default', ...rest},
  ref,
) {
  const selection =
    selected === undefined ? null : (
      <CheckIcon aria-hidden="true" className={cn('size-4 shrink-0', !selected && 'invisible')} />
    )
  const statusIndicator = loading ? <Spinner aria-hidden="true" className="shrink-0" size="small" /> : selection

  return (
    <Menu.Item
      {...rest}
      ref={ref}
      disabled={disabled || Boolean(inactiveText) || loading}
      aria-disabled={inactiveText || loading ? true : undefined}
      title={typeof inactiveText === 'string' ? inactiveText : undefined}
      className={mergeClassName(
        cn(
          actionItemClassName,
          'mx-2 !w-[calc(100%-1rem)]',
          'data-[highlighted]:bg-neutral-muted data-[highlighted]:text-default',
          variant === 'danger' && 'text-danger-fg data-[highlighted]:bg-[var(--control-danger-bgColor-hover)]',
        ),
        className,
      )}
      data-component="ActionMenu.Item"
      data-selected={selected || undefined}
      data-variant={variant === 'danger' ? variant : undefined}
    >
      <ActionItemContent selection={statusIndicator} supportingText={inactiveText}>
        {children}
      </ActionItemContent>
      {loading && loadingText ? <span className="sr-only">{loadingText}</span> : null}
    </Menu.Item>
  )
})

export type ActionMenuCheckboxItemProps = Omit<Menu.CheckboxItem.Props, 'data-component'>
const CheckboxItem = React.forwardRef<HTMLElement, ActionMenuCheckboxItemProps>(function ActionMenuCheckboxItem(
  {children, className, ...rest},
  ref,
) {
  return (
    <Menu.CheckboxItem
      {...rest}
      ref={ref}
      className={mergeClassName(
        cn(
          actionItemClassName,
          'group mx-2 !w-[calc(100%-1rem)] data-[highlighted]:bg-neutral-muted data-[highlighted]:text-default',
        ),
        className,
      )}
      data-component="ActionMenu.CheckboxItem"
    >
      <ActionItemContent
        selection={
          <span
            aria-hidden="true"
            className="grid size-4 shrink-0 place-items-center rounded-sm border border-[var(--control-borderColor-emphasis)] bg-default group-data-[checked]:border-[var(--control-checked-bgColor-rest)] group-data-[checked]:bg-[var(--control-checked-bgColor-rest)] group-data-[checked]:text-on-emphasis"
          >
            <CheckIcon className="size-3 invisible group-data-[checked]:visible" />
          </span>
        }
      >
        {children}
      </ActionItemContent>
    </Menu.CheckboxItem>
  )
})

export type ActionMenuRadioItemProps = Omit<Menu.RadioItem.Props, 'data-component'>
const RadioItem = React.forwardRef<HTMLElement, ActionMenuRadioItemProps>(function ActionMenuRadioItem(
  {children, className, ...rest},
  ref,
) {
  return (
    <Menu.RadioItem
      {...rest}
      ref={ref}
      className={mergeClassName(
        cn(
          actionItemClassName,
          'group mx-2 !w-[calc(100%-1rem)] data-[highlighted]:bg-neutral-muted data-[highlighted]:text-default',
        ),
        className,
      )}
      data-component="ActionMenu.RadioItem"
    >
      <ActionItemContent
        selection={<CheckIcon aria-hidden="true" className="size-4 shrink-0 invisible group-data-[checked]:visible" />}
      >
        {children}
      </ActionItemContent>
    </Menu.RadioItem>
  )
})

export type ActionMenuSubmenuTriggerProps = Omit<Menu.SubmenuTrigger.Props, 'data-component'>
const SubmenuTrigger = React.forwardRef<HTMLElement, ActionMenuSubmenuTriggerProps>(function ActionMenuSubmenuTrigger(
  {children, className, ...rest},
  ref,
) {
  return (
    <Menu.SubmenuTrigger
      {...rest}
      ref={ref}
      className={mergeClassName(
        cn(
          actionItemClassName,
          'mx-2 !w-[calc(100%-1rem)] data-[highlighted]:bg-neutral-muted data-[highlighted]:text-default',
        ),
        className,
      )}
      data-component="ActionMenu.SubmenuTrigger"
    >
      <ActionItemContent>
        {children}
        {/* eslint-disable-next-line primer-react/direct-slot-children -- ActionItemContent owns the shared item layout. */}
        <ActionList.TrailingVisual>
          <ChevronRightIcon aria-hidden="true" />
        </ActionList.TrailingVisual>
      </ActionItemContent>
    </Menu.SubmenuTrigger>
  )
})

const Group = React.forwardRef<HTMLDivElement, Menu.Group.Props>(function ActionMenuGroup({className, ...props}, ref) {
  return (
    <Menu.Group
      {...props}
      ref={ref}
      className={mergeClassName('[&+&]:mt-2', className)}
      data-component="ActionMenu.Group"
    />
  )
})

const GroupLabel = React.forwardRef<HTMLDivElement, Menu.GroupLabel.Props>(function ActionMenuGroupLabel(
  {className, ...props},
  ref,
) {
  return (
    <Menu.GroupLabel
      {...props}
      ref={ref}
      className={mergeClassName(
        'flex min-h-[30px] items-center px-4 py-1.5 text-xs leading-[18px] font-semibold text-muted',
        className,
      )}
      data-component="ActionMenu.GroupLabel"
    />
  )
})

const Divider = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
  function ActionMenuDivider(props, ref) {
    return (
      <Menu.Separator
        {...props}
        ref={ref}
        className={cn(
          "relative h-4 border-0 after:absolute after:inset-x-4 after:top-1/2 after:h-px after:bg-[var(--borderColor-muted)] after:content-['']",
          props.className,
        )}
        data-component="ActionMenu.Divider"
      />
    )
  },
)

export const ActionMenu = Object.assign(Root, {
  Root,
  Trigger,
  Button: ButtonTrigger,
  /** Alias retained for ActionMenu's established overlay vocabulary. */
  Content,
  Overlay: Content,
  Item,
  CheckboxItem,
  RadioGroup: Menu.RadioGroup,
  RadioItem,
  Group,
  GroupLabel,
  Divider,
  Submenu: Menu.SubmenuRoot,
  SubmenuTrigger,
  LeadingVisual: ActionList.LeadingVisual,
  TrailingVisual: ActionList.TrailingVisual,
  Description: ActionList.Description,
})
;(ActionMenu as {displayName?: string}).displayName = 'ActionMenu'
;('use client')
