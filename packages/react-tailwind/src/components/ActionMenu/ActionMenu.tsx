import {TriangleDownIcon} from '@primer/octicons-react'
import {Menu} from '@base-ui/react/menu'
import React from 'react'
import {cn} from '../../internal/cn'
import {Button, type ButtonProps} from '../Button'
import {mergeClassName} from '../ActionList/selectionUtils'

const menuItemClassName =
  'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-default outline-none data-[highlighted]:bg-neutral-muted data-[highlighted]:text-default data-[disabled]:cursor-not-allowed data-[disabled]:text-disabled'
const triggerClassName =
  'inline-flex min-h-8 items-center justify-center gap-2 rounded-md border border-default bg-default px-3 text-sm font-semibold text-default hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:text-disabled'

export type ActionMenuRootProps = Menu.Root.Props

const Root = Menu.Root

export type ActionMenuTriggerProps = Omit<Menu.Trigger.Props, 'data-component'>

const Trigger = React.forwardRef<HTMLButtonElement, ActionMenuTriggerProps>(function ActionMenuTrigger(
  {className, ...rest},
  ref,
) {
  return (
    <Menu.Trigger
      {...rest}
      ref={ref}
      className={mergeClassName(triggerClassName, className)}
      data-component="ActionMenu.Trigger"
    />
  )
})

export interface ActionMenuButtonProps extends Omit<ButtonProps, 'data-component' | 'render' | 'trailingVisual'> {
  children?: React.ReactNode
}

const ButtonTrigger = React.forwardRef<HTMLButtonElement, ActionMenuButtonProps>(function ActionMenuButton(
  {children, className, disabled, loading, ...buttonProps},
  ref,
) {
  return (
    <Menu.Trigger
      disabled={disabled || loading}
      render={
        <Button
          {...buttonProps}
          ref={ref}
          className={className}
          disabled={disabled}
          loading={loading}
          trailingVisual={<TriangleDownIcon aria-hidden="true" />}
          data-component="ActionMenu.Button"
        />
      }
    >
      {children}
    </Menu.Trigger>
  )
})

export interface ActionMenuContentProps extends Omit<Menu.Popup.Props, 'data-component'> {
  align?: Menu.Positioner.Props['align']
  side?: Menu.Positioner.Props['side']
  sideOffset?: Menu.Positioner.Props['sideOffset']
  portal?: boolean
  positionerClassName?: string
}

const Content = React.forwardRef<HTMLDivElement, ActionMenuContentProps>(function ActionMenuContent(
  {align = 'start', children, className, portal = true, positionerClassName, side = 'bottom', sideOffset = 4, ...rest},
  ref,
) {
  const popup = (
    <Menu.Positioner
      align={align}
      side={side}
      sideOffset={sideOffset}
      className={cn('z-popover', positionerClassName)}
      data-component="ActionMenu.Positioner"
    >
      <Menu.Popup
        {...rest}
        ref={ref}
        className={mergeClassName(
          'min-w-48 rounded-md border border-default bg-default p-1 shadow-floating-lg outline-none data-[closed]:hidden',
          className,
        )}
        data-component="ActionMenu.Content"
      >
        {children}
      </Menu.Popup>
    </Menu.Positioner>
  )
  return portal ? <Menu.Portal>{popup}</Menu.Portal> : popup
})

export interface ActionMenuItemProps extends Omit<Menu.Item.Props, 'data-component'> {
  variant?: 'default' | 'danger'
}

const Item = React.forwardRef<HTMLElement, ActionMenuItemProps>(function ActionMenuItem(
  {className, variant = 'default', ...rest},
  ref,
) {
  return (
    <Menu.Item
      {...rest}
      ref={ref}
      className={mergeClassName(
        cn(menuItemClassName, variant === 'danger' && 'text-danger-fg data-[highlighted]:bg-danger-subtle'),
        className,
      )}
      data-component="ActionMenu.Item"
      data-variant={variant === 'danger' ? variant : undefined}
    />
  )
})

export type ActionMenuCheckboxItemProps = Omit<Menu.CheckboxItem.Props, 'data-component'>
const CheckboxItem = React.forwardRef<HTMLElement, ActionMenuCheckboxItemProps>(function ActionMenuCheckboxItem(
  {className, ...rest},
  ref,
) {
  return (
    <Menu.CheckboxItem
      {...rest}
      ref={ref}
      className={mergeClassName(menuItemClassName, className)}
      data-component="ActionMenu.CheckboxItem"
    />
  )
})

const Divider = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
  function ActionMenuDivider(props, ref) {
    return (
      <Menu.Separator
        {...props}
        ref={ref}
        className={cn('my-1 border-t border-default', props.className)}
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
  RadioItem: Menu.RadioItem,
  Group: Menu.Group,
  GroupLabel: Menu.GroupLabel,
  Divider,
})
;(ActionMenu as {displayName?: string}).displayName = 'ActionMenu'
