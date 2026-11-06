'use client'

import {CheckIcon, ChevronRightIcon, TriangleDownIcon} from '@primer/octicons-react'
import {Menu} from '@base-ui/react/menu'
import React from 'react'
import {cn} from '../../internal/cn'
import {mergeClassName} from '../../internal/mergeClassName'
import {NarrowFullscreenCloseButton} from '../../internal/NarrowFullscreenCloseButton'
import {
  isNarrowFullscreen,
  narrowFullscreenPopupClassName,
  narrowFullscreenPositionerClassName,
} from '../../internal/narrowFullscreen'
import {overlaySizeClassName} from '../../internal/overlaySize'
import {FloatingPortal} from '../../internal/FloatingPortal'
import {usePortalContainer} from '../../internal/portalRoot'
import type {AnchoredOverlayVariant, FloatingContentProps, FloatingSide, OverlaySizeProps} from '../../utils/types'
import {ActionItemContent, actionListDividerClassName, ActionList} from '../ActionList/ActionList'
import {
  actionItemClassName,
  getActionItemStateAttributes,
  getActionItemStateClassName,
  type ActionItemStateOptions,
} from '../ActionList/itemState'
import {Button, type ButtonProps} from '../Button'
import {Spinner} from '../Spinner'
import {ActionMenuActionsContext, ActionMenuListContext} from './ActionMenuContext'
const triggerClassName =
  'inline-flex min-h-8 items-center justify-center gap-2 rounded-md border border-default bg-default px-3 text-sm font-semibold text-default hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:text-disabled'

export type ActionMenuRootProps = Menu.Root.Props

function Root({actionsRef, ...rest}: ActionMenuRootProps) {
  const ownActionsRef = React.useRef<Menu.Root.Actions | null>(null)
  const menuActionsRef = actionsRef ?? ownActionsRef
  return (
    <ActionMenuActionsContext.Provider value={menuActionsRef}>
      <Menu.Root {...rest} actionsRef={menuActionsRef} />
    </ActionMenuActionsContext.Provider>
  )
}

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
  {children, className, disabled, id, loading, size = 'medium', ...buttonProps},
  ref,
) {
  return (
    <Menu.Trigger
      // The trigger tracks its open state by `id`, so it must not be overridden on the render element.
      id={id}
      disabled={disabled || loading}
      render={
        <Button
          {...buttonProps}
          ref={ref}
          className={className}
          disabled={disabled}
          loading={loading}
          size={size}
          trailingAction={TriangleDownIcon}
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
    FloatingContentProps,
    OverlaySizeProps {
  /** If true, focus will not be returned to the trigger or `finalFocus` target when the menu closes. */
  preventFocusOnClose?: boolean
  /** Draws a divider between consecutive items. */
  showDividers?: boolean
  /** Side of the trigger the menu opens on. Menus open below their trigger, and submenus beside it. */
  side?: FloatingSide
  /**
   * How the menu is presented at each viewport range. `{narrow: 'fullscreen'}` covers narrow viewports and adds a
   * close button.
   * @default 'anchored'
   */
  variant?: AnchoredOverlayVariant
}

const Content = React.forwardRef<HTMLDivElement, ActionMenuContentProps>(function ActionMenuContent(
  {
    align = 'start',
    alignOffset,
    anchor,
    children,
    className,
    finalFocus,
    height,
    maxHeight,
    maxWidth,
    portal = true,
    positionerClassName,
    preventFocusOnClose = false,
    showDividers = false,
    side,
    sideOffset = 4,
    variant = 'anchored',
    width,
    ...rest
  },
  ref,
) {
  const actionsRef = React.useContext(ActionMenuActionsContext)
  const fullscreen = isNarrowFullscreen(variant)

  return (
    <FloatingPortal part={Portal} portal={portal}>
      <Menu.Positioner
        align={align}
        alignOffset={alignOffset}
        anchor={anchor}
        side={side}
        sideOffset={sideOffset}
        className={cn(
          'z-popover',
          fullscreen && [narrowFullscreenPositionerClassName, 'max-md:pt-9'],
          positionerClassName,
        )}
        data-component="ActionMenu.Positioner"
        data-responsive={fullscreen ? 'fullscreen' : undefined}
      >
        {fullscreen ? (
          // The menu role only allows items, so the close button sits beside the popup rather than inside it.
          <NarrowFullscreenCloseButton
            data-component="ActionMenu.CloseButton"
            onClick={() => actionsRef?.current?.close()}
          />
        ) : null}
        <Menu.Popup
          {...rest}
          ref={ref}
          finalFocus={preventFocusOnClose ? false : finalFocus}
          className={mergeClassName(
            cn(
              'max-h-[var(--available-height)] min-w-48 overflow-y-auto rounded-lg bg-[var(--overlay-bgColor)] py-2 shadow-floating-sm outline-none contrast-more:border contrast-more:border-current data-[closed]:hidden',
              overlaySizeClassName({height, maxHeight, maxWidth, width}),
              fullscreen && narrowFullscreenPopupClassName,
            ),
            className,
          )}
          data-component="ActionMenu.Content"
          data-dividers={showDividers || undefined}
        >
          <ActionMenuListContext.Provider value={{showDividers}}>{children}</ActionMenuListContext.Provider>
        </Menu.Popup>
      </Menu.Positioner>
    </FloatingPortal>
  )
})

function Portal({children, container, ...rest}: Menu.Portal.Props) {
  const portalContainer = usePortalContainer(container)
  // The portal root resolves only on the client, so the menu renders nothing on the server.
  if (portalContainer === undefined) return null
  return (
    <Menu.Portal {...rest} container={portalContainer}>
      {children}
    </Menu.Portal>
  )
}

type ActionMenuItemVariant = 'default' | 'danger'

/**
 * Every menu row shares the ActionList item layout and state colors, inset by the popup's padding. Pointer hover fills
 * the row, and keyboard focus draws the focus ring around it, as focused ActionList items do.
 */
function menuItemClassName(state: ActionItemStateOptions = {}) {
  return cn(
    actionItemClassName,
    'mx-2 !w-[calc(100%-1rem)] focus-visible:outline-offset-0',
    getActionItemStateClassName(state),
  )
}

/**
 * Menu rows are siblings rather than list items, so a row draws its divider only when it directly follows another
 * row. Group labels and dividers break the run, and a highlighted row hides the dividers on both of its edges.
 */
const menuItemDividerClassName = cn(
  "relative before:absolute before:inset-x-0 before:-top-[7px] before:hidden before:h-px before:bg-[var(--borderColor-muted)] before:content-['']",
  '[[role^=menuitem]:not([data-highlighted])+[role^=menuitem]:not([data-highlighted])>&]:before:block',
)

function MenuItemContent(
  props: Omit<React.ComponentProps<typeof ActionItemContent>, 'dividerClassName' | 'showDivider'>,
) {
  const {showDividers} = React.useContext(ActionMenuListContext)
  return <ActionItemContent {...props} dividerClassName={menuItemDividerClassName} showDivider={showDividers} />
}

export interface ActionMenuItemProps extends Omit<Menu.Item.Props, 'data-component'> {
  /** Marks the item temporarily unavailable and explains why. */
  inactiveText?: React.ReactNode
  /** Shows a spinner in place of the leading visual, or the trailing visual when there is none, and suppresses activation. */
  loading?: boolean
  /** Text announced to assistive technology while the item is loading. */
  loadingText?: string
  /** Marks the item as the current choice. */
  selected?: boolean
  /** Use `danger` for a destructive action. */
  variant?: ActionMenuItemVariant
}

const Item = React.forwardRef<HTMLElement, ActionMenuItemProps>(function ActionMenuItem(
  {children, className, disabled, inactiveText, loading = false, loadingText, selected, variant = 'default', ...rest},
  ref,
) {
  const selection =
    selected === undefined ? null : (
      <CheckIcon aria-hidden="true" className={cn('size-4 shrink-0', !selected && 'invisible')} />
    )
  const statusIndicator = loading ? (
    <Spinner aria-hidden="true" className="shrink-0" size="small" srText={null} />
  ) : null
  const state = {disabled, inactive: Boolean(inactiveText), loading, variant}

  return (
    <Menu.Item
      {...rest}
      {...getActionItemStateAttributes(state)}
      ref={ref}
      disabled={disabled || Boolean(inactiveText) || loading}
      title={typeof inactiveText === 'string' ? inactiveText : undefined}
      className={mergeClassName(menuItemClassName(state), className)}
      data-component="ActionMenu.Item"
      data-selected={selected || undefined}
    >
      <MenuItemContent indicator={statusIndicator} selection={selection} supportingText={inactiveText}>
        {children}
      </MenuItemContent>
      {loading && loadingText ? <span className="sr-only">{loadingText}</span> : null}
    </Menu.Item>
  )
})

export interface ActionMenuLinkItemProps extends Omit<Menu.LinkItem.Props, 'data-component'> {
  /**
   * Whether activating the link closes the menu, as activating any other menu item does.
   * @default true
   */
  closeOnClick?: boolean
  /** Marks the link temporarily unavailable and explains why. The link renders as an inactive item until it is available. */
  inactiveText?: React.ReactNode
  /** Use `danger` for a destructive navigation. */
  variant?: ActionMenuItemVariant
}

const LinkItem = React.forwardRef<HTMLAnchorElement, ActionMenuLinkItemProps>(function ActionMenuLinkItem(
  {children, className, closeOnClick = true, id, inactiveText, label, variant = 'default', ...rest},
  ref,
) {
  if (inactiveText) {
    // Links can't be disabled, so an unavailable link stays discoverable as an inactive item instead.
    return (
      <Item className={className} id={id} inactiveText={inactiveText} label={label} variant={variant}>
        {children}
      </Item>
    )
  }

  return (
    <Menu.LinkItem
      {...rest}
      {...getActionItemStateAttributes({variant})}
      ref={ref}
      id={id}
      closeOnClick={closeOnClick}
      label={label}
      className={mergeClassName(menuItemClassName({variant}), className)}
      data-component="ActionMenu.LinkItem"
    >
      <MenuItemContent>{children}</MenuItemContent>
    </Menu.LinkItem>
  )
})

/** Menus mark checked checkbox and radio items with a checkmark, as menu selections do in Primer. */
const checkedItemIndicator = (
  <CheckIcon aria-hidden="true" className="size-4 shrink-0 invisible group-data-[checked]:visible" />
)

export interface ActionMenuCheckboxItemProps extends Omit<Menu.CheckboxItem.Props, 'data-component'> {
  /**
   * Whether toggling the item closes the menu, as activating any other menu item does. Set `false` to keep the menu
   * open while several items are toggled.
   * @default true
   */
  closeOnClick?: boolean
}

const CheckboxItem = React.forwardRef<HTMLElement, ActionMenuCheckboxItemProps>(function ActionMenuCheckboxItem(
  {children, className, closeOnClick = true, ...rest},
  ref,
) {
  return (
    <Menu.CheckboxItem
      {...rest}
      ref={ref}
      closeOnClick={closeOnClick}
      className={mergeClassName(cn('group', menuItemClassName({disabled: rest.disabled})), className)}
      data-component="ActionMenu.CheckboxItem"
    >
      <MenuItemContent selection={checkedItemIndicator}>{children}</MenuItemContent>
    </Menu.CheckboxItem>
  )
})

export interface ActionMenuRadioItemProps extends Omit<Menu.RadioItem.Props, 'data-component'> {
  /**
   * Whether choosing the item closes the menu, as activating any other menu item does.
   * @default true
   */
  closeOnClick?: boolean
}

const RadioItem = React.forwardRef<HTMLElement, ActionMenuRadioItemProps>(function ActionMenuRadioItem(
  {children, className, closeOnClick = true, ...rest},
  ref,
) {
  return (
    <Menu.RadioItem
      {...rest}
      ref={ref}
      closeOnClick={closeOnClick}
      className={mergeClassName(cn('group', menuItemClassName({disabled: rest.disabled})), className)}
      data-component="ActionMenu.RadioItem"
    >
      <MenuItemContent selection={checkedItemIndicator}>{children}</MenuItemContent>
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
          menuItemClassName({disabled: rest.disabled}),
          // The trigger stays filled while its submenu is open, so the path to the submenu is visible.
          'data-[popup-open]:bg-[var(--control-transparent-bgColor-hover)]',
        ),
        className,
      )}
      data-component="ActionMenu.SubmenuTrigger"
    >
      <MenuItemContent>
        {children}
        {/* eslint-disable-next-line primer-react/direct-slot-children -- ActionItemContent owns the shared item layout. */}
        <ActionList.TrailingVisual>
          <ChevronRightIcon aria-hidden="true" />
        </ActionList.TrailingVisual>
      </MenuItemContent>
    </Menu.SubmenuTrigger>
  )
})

/** Adjacent groups, including radio groups, are spaced apart as ActionList groups are. */
const groupClassName = '[&+&]:mt-2'

export type ActionMenuGroupProps = Omit<Menu.Group.Props, 'data-component'>
const Group = React.forwardRef<HTMLDivElement, ActionMenuGroupProps>(function ActionMenuGroup(
  {className, ...props},
  ref,
) {
  return (
    <Menu.Group
      {...props}
      ref={ref}
      className={mergeClassName(groupClassName, className)}
      data-component="ActionMenu.Group"
    />
  )
})

export type ActionMenuRadioGroupProps = Omit<Menu.RadioGroup.Props, 'data-component'>
const RadioGroup = React.forwardRef<HTMLDivElement, ActionMenuRadioGroupProps>(function ActionMenuRadioGroup(
  {className, ...props},
  ref,
) {
  return (
    <Menu.RadioGroup
      {...props}
      ref={ref}
      className={mergeClassName(groupClassName, className)}
      data-component="ActionMenu.RadioGroup"
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
        className={cn(actionListDividerClassName, props.className)}
        data-component="ActionMenu.Divider"
      />
    )
  },
)

export const ActionMenu = Object.assign(Root, {
  Root,
  Trigger,
  Button: ButtonTrigger,
  Content,
  /** Alias retained for ActionMenu's established overlay vocabulary. */
  Overlay: Content,
  Item,
  LinkItem,
  CheckboxItem,
  RadioGroup,
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
