'use client'

import {KebabHorizontalIcon} from '@primer/octicons-react'
import {Toolbar} from '@base-ui/react/toolbar'
import React from 'react'
import {cn} from '../../internal/cn'
import {isIconComponent, renderIcon, type IconSource} from '../../internal/icon'
import {OverflowObserverProvider} from '../../internal/OverflowObserverProvider'
import {
  type OverflowItem,
  type RegisterOverflowItem,
  useIsClipped,
  useOverflowRegistry,
  useRegisterOverflowItem,
} from '../../internal/overflow'
import {mergeRefs} from '../../internal/refs'
import type {ControlSize} from '../../utils/types'
import {ActionMenu} from '../ActionMenu'
import {Button as SharedButton, type ButtonProps} from '../Button'
import {IconButton as SharedIconButton, type IconButtonProps} from '../IconButton'

export interface ActionBarProps extends React.ComponentPropsWithoutRef<typeof Toolbar.Root> {
  /**
   * Size of the bar's controls.
   * @default 'medium'
   */
  size?: ControlSize
  /**
   * Removes the bar's outer padding so it aligns with surrounding content.
   * @default false
   */
  flush?: boolean
  /**
   * Spacing between items.
   * @default 'condensed'
   */
  gap?: 'none' | 'condensed'
}

export type ActionBarMenuItemProps =
  | {
      /**
       * Renders an action. Omit for an action.
       * @default 'action'
       */
      type?: 'action'
      /** Text for the item. */
      label: string
      /** Prevents selecting the item. */
      disabled?: boolean
      /** Icon before the label: a component such as an Octicon, or a rendered element. */
      leadingVisual?: IconSource
      /** Icon or short text, such as a keyboard shortcut, after the label. */
      trailingVisual?: IconSource
      /** Called when the item is selected. */
      onClick?: React.MouseEventHandler<HTMLElement>
      /** Items for a submenu opened from this item. */
      items?: ActionBarMenuItemProps[]
      /**
       * Use `danger` for a destructive action.
       * @default 'default'
       */
      variant?: 'default' | 'danger'
    }
  | {
      /** Renders a divider between groups of items. */
      type: 'divider'
    }

type OverflowEntry =
  | {
      type: 'action'
      label: React.ReactNode
      icon?: IconSource
      disabled: boolean
      onClick?: React.MouseEventHandler<HTMLElement>
    }
  | {type: 'divider'}
  | {
      type: 'menu'
      label: string
      icon: IconSource | 'none'
      items: ActionBarMenuItemProps[]
      returnFocusRef?: React.RefObject<HTMLElement | null>
    }
type OverflowEntries = Array<[string, OverflowItem<OverflowEntry>]>

const ActionBarContext = React.createContext<ControlSize>('medium')
const ActionBarRegistryContext = React.createContext<RegisterOverflowItem<OverflowEntry> | null>(null)
/** Whether the enclosing `ActionBar.Group` overflows; `null` outside a group. */
const ActionBarGroupContext = React.createContext<boolean | null>(null)

/** Drops dividers that would not separate two overflowing items. */
function trimDividers(items: OverflowEntries) {
  const result: OverflowEntries = []
  for (const item of items) {
    const isDivider = item[1].entry.type === 'divider'
    if (isDivider && (result.length === 0 || result.at(-1)?.[1].entry.type === 'divider')) continue
    result.push(item)
  }
  if (result.at(-1)?.[1].entry.type === 'divider') result.pop()
  return result
}

/**
 * Tracks whether an item is clipped out of the bar and, while it is, registers it with the "More items" menu. Items in
 * a group follow the group, which overflows as a whole.
 */
function useActionBarItem(element: Element | null, entry: OverflowEntry) {
  const register = React.useContext(ActionBarRegistryContext)
  const isGroupOverflowing = React.useContext(ActionBarGroupContext)
  const isClipped = useIsClipped(element, isGroupOverflowing !== null)
  const isOverflowing = isGroupOverflowing === true || isClipped
  useRegisterOverflowItem(register, element, isOverflowing ? entry : null)
  return isOverflowing
}

function renderMenuItem(item: ActionBarMenuItemProps, index: number): React.ReactNode {
  if (item.type === 'divider') return <ActionMenu.Divider key={index} />

  const {disabled, items, label, leadingVisual, onClick, trailingVisual, variant} = item
  const content = (
    <>
      {leadingVisual ? <ActionMenu.LeadingVisual>{renderIcon(leadingVisual)}</ActionMenu.LeadingVisual> : null}
      {label}
      {trailingVisual ? <ActionMenu.TrailingVisual>{renderIcon(trailingVisual)}</ActionMenu.TrailingVisual> : null}
    </>
  )

  if (items && items.length > 0) {
    return (
      <ActionMenu.Submenu key={`${index}-${label}`}>
        <ActionMenu.SubmenuTrigger disabled={disabled} label={label}>
          {content}
        </ActionMenu.SubmenuTrigger>
        <ActionMenu.Content side="right">{items.map(renderMenuItem)}</ActionMenu.Content>
      </ActionMenu.Submenu>
    )
  }

  return (
    <ActionMenu.Item key={`${index}-${label}`} disabled={disabled} label={label} onClick={onClick} variant={variant}>
      {content}
    </ActionMenu.Item>
  )
}

function renderOverflowEntry([id, {entry}]: [string, OverflowItem<OverflowEntry>]): React.ReactNode {
  if (entry.type === 'divider') return <ActionMenu.Divider key={id} />

  const visual =
    entry.icon && entry.icon !== 'none' ? (
      <ActionMenu.LeadingVisual>{renderIcon(entry.icon)}</ActionMenu.LeadingVisual>
    ) : null

  if (entry.type === 'menu') {
    return (
      <ActionMenu.Submenu key={id}>
        <ActionMenu.SubmenuTrigger label={entry.label}>
          {visual}
          {entry.label}
        </ActionMenu.SubmenuTrigger>
        <ActionMenu.Content side="right" finalFocus={entry.returnFocusRef}>
          {entry.items.map(renderMenuItem)}
        </ActionMenu.Content>
      </ActionMenu.Submenu>
    )
  }

  return (
    <ActionMenu.Item key={id} disabled={entry.disabled} onClick={entry.onClick}>
      {visual}
      {entry.label}
    </ActionMenu.Item>
  )
}

interface MenuTriggerProps extends Omit<IconButtonProps, 'data-component' | 'variant'> {
  'data-component': string
  isOverflowing?: boolean
}

/** An icon button that is both a toolbar item and an ActionMenu trigger. */
const MenuTrigger = React.forwardRef<HTMLButtonElement, MenuTriggerProps>(function ActionBarMenuTrigger(
  {
    'aria-label': ariaLabel,
    'data-component': dataComponent,
    disabled,
    icon,
    id,
    isOverflowing = false,
    size: sizeProp,
    ...props
  },
  ref,
) {
  const contextSize = React.useContext(ActionBarContext)
  const size = sizeProp ?? contextSize
  return (
    <Toolbar.Button
      ref={ref}
      // Passed down the render chain so the menu and tooltip triggers track the element they render.
      id={id}
      aria-label={ariaLabel}
      data-component={dataComponent}
      data-overflowing={isOverflowing || undefined}
      disabled={disabled || isOverflowing}
      focusableWhenDisabled={!isOverflowing}
      render={
        <ActionMenu.Trigger
          render={
            <SharedIconButton
              {...props}
              aria-label={ariaLabel}
              data-component={dataComponent}
              icon={icon}
              size={size}
              variant="invisible"
            />
          }
        />
      }
    />
  )
})

const Root = React.forwardRef<HTMLDivElement, ActionBarProps>(function ActionBar(
  {
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    children,
    className,
    size = 'medium',
    flush = false,
    gap = 'condensed',
    onKeyDown,
    ...props
  },
  ref,
) {
  const [toolbar, setToolbar] = React.useState<HTMLDivElement | null>(null)
  const [overflowItems, register] = useOverflowRegistry<OverflowEntry>()
  const overflowEntries = trimDividers(overflowItems)
  const hasOverflow = overflowEntries.length > 0

  const handleKeyDown: NonNullable<ActionBarProps['onKeyDown']> = event => {
    onKeyDown?.(event)
    if (event.defaultPrevented || (event.key !== 'Home' && event.key !== 'End')) return
    const actions = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>('[data-focusable]:not([data-disabled])'),
    )
    const action = event.key === 'Home' ? actions[0] : actions.at(-1)
    if (action) {
      event.preventDefault()
      action.focus()
    }
  }

  return (
    <ActionBarContext.Provider value={size}>
      <div
        ref={ref}
        data-component="ActionBar"
        data-flush={flush || undefined}
        className={cn('flex items-center justify-end px-4', flush && 'px-0', className)}
      >
        <Toolbar.Root
          {...props}
          ref={setToolbar}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          data-size={size}
          data-gap={gap}
          data-has-overflow={hasOverflow || undefined}
          onKeyDown={handleKeyDown}
          className={cn(
            'group relative -mb-px flex h-8 min-w-0 items-start overflow-hidden [contain:layout] data-[size=small]:h-7 data-[size=large]:h-10',
            gap === 'condensed' && 'gap-2',
          )}
        >
          <div className="flex flex-wrap justify-end gap-[inherit] overflow-hidden [contain:layout]">
            {/* An empty first item lets even the first real item wrap onto the clipped second line. */}
            <div aria-hidden="true" className="h-8 group-data-[size=small]:h-7 group-data-[size=large]:h-10" />
            <OverflowObserverProvider root={toolbar}>
              <ActionBarRegistryContext.Provider value={register}>{children}</ActionBarRegistryContext.Provider>
            </OverflowObserverProvider>
          </div>
          {hasOverflow ? (
            <ActionMenu>
              <MenuTrigger aria-label="More items" data-component="ActionBar.MoreButton" icon={KebabHorizontalIcon} />
              <ActionMenu.Content sideOffset={4}>{overflowEntries.map(renderOverflowEntry)}</ActionMenu.Content>
            </ActionMenu>
          ) : null}
        </Toolbar.Root>
      </div>
    </ActionBarContext.Provider>
  )
})

export type ActionBarButtonProps = Omit<ButtonProps, 'data-component' | 'size' | 'variant'> & {
  /** Height and text size of the button. Defaults to the `size` of the `ActionBar`. */
  size?: ButtonProps['size']
}
const Button = React.forwardRef<HTMLButtonElement, ActionBarButtonProps>(function ActionBarButton(
  {children, className, disabled = false, leadingVisual, onClick, size: sizeProp, ...props},
  ref,
) {
  const contextSize = React.useContext(ActionBarContext)
  const size = sizeProp ?? contextSize
  const [element, setElement] = React.useState<HTMLButtonElement | null>(null)
  const isOverflowing = useActionBarItem(element, {
    type: 'action',
    label: children,
    icon:
      leadingVisual && (isIconComponent(leadingVisual) || React.isValidElement(leadingVisual))
        ? leadingVisual
        : undefined,
    disabled,
    onClick: onClick as React.MouseEventHandler<HTMLElement> | undefined,
  })
  return (
    <Toolbar.Button
      {...props}
      ref={mergeRefs(ref, setElement)}
      disabled={disabled || isOverflowing}
      focusableWhenDisabled={!isOverflowing}
      onClick={onClick}
      render={
        <SharedButton data-component="ActionBar.Button" leadingVisual={leadingVisual} size={size} variant="invisible" />
      }
      data-component="ActionBar.Button"
      data-overflowing={isOverflowing || undefined}
      className={className}
    >
      {children}
    </Toolbar.Button>
  )
})

export type ActionBarIconButtonProps = Omit<IconButtonProps, 'data-component' | 'size' | 'variant'> & {
  /** Height of the button. Defaults to the `size` of the `ActionBar`. */
  size?: IconButtonProps['size']
}
const IconButton = React.forwardRef<HTMLButtonElement, ActionBarIconButtonProps>(function ActionBarIconButton(
  {'aria-label': ariaLabel, className, disabled = false, icon, onClick, size: sizeProp, ...props},
  ref,
) {
  const contextSize = React.useContext(ActionBarContext)
  const size = sizeProp ?? contextSize
  const [element, setElement] = React.useState<HTMLButtonElement | null>(null)
  const isOverflowing = useActionBarItem(element, {
    type: 'action',
    label: ariaLabel,
    icon,
    disabled,
    onClick: onClick as React.MouseEventHandler<HTMLElement> | undefined,
  })
  return (
    <Toolbar.Button
      {...props}
      ref={mergeRefs(ref, setElement)}
      aria-label={ariaLabel}
      disabled={disabled || isOverflowing}
      focusableWhenDisabled={!isOverflowing}
      onClick={onClick}
      render={
        <SharedIconButton
          aria-label={ariaLabel}
          data-component="ActionBar.IconButton"
          icon={icon}
          size={size}
          variant="invisible"
        />
      }
      data-component="ActionBar.IconButton"
      data-overflowing={isOverflowing || undefined}
      className={className}
    />
  )
})

export type ActionBarGroupProps = React.ComponentPropsWithoutRef<typeof Toolbar.Group>
const Group = React.forwardRef<HTMLDivElement, ActionBarGroupProps>(function ActionBarGroup(
  {className, ...props},
  ref,
) {
  const [element, setElement] = React.useState<HTMLDivElement | null>(null)
  const isParentOverflowing = React.useContext(ActionBarGroupContext)
  const isClipped = useIsClipped(element, isParentOverflowing !== null)
  const isOverflowing = isParentOverflowing === true || isClipped
  return (
    <ActionBarGroupContext.Provider value={isOverflowing}>
      <Toolbar.Group
        {...props}
        ref={mergeRefs(ref, setElement)}
        data-component="ActionBar.Group"
        data-overflowing={isOverflowing || undefined}
        className={cn('flex gap-[inherit]', className)}
      />
    </ActionBarGroupContext.Provider>
  )
})

export type ActionBarDividerProps = React.ComponentPropsWithoutRef<typeof Toolbar.Separator>
const Divider = React.forwardRef<HTMLDivElement, ActionBarDividerProps>(function ActionBarDivider(
  {className, ...props},
  ref,
) {
  const [element, setElement] = React.useState<HTMLDivElement | null>(null)
  const isOverflowing = useActionBarItem(element, {type: 'divider'})
  return (
    <Toolbar.Separator
      {...props}
      ref={mergeRefs(ref, setElement)}
      data-component="ActionBar.Divider"
      data-overflowing={isOverflowing || undefined}
      className={cn('h-5 w-px self-center bg-muted group-data-[gap=none]:mx-2', className)}
    />
  )
})

export interface ActionBarMenuProps extends Omit<ActionBarIconButtonProps, 'aria-label' | 'icon' | 'onClick'> {
  /** Accessible name for the menu trigger, also used as its label when the menu overflows. */
  'aria-label': string
  /** Icon for the menu trigger: a component such as an Octicon, or a rendered element. */
  icon: IconSource
  /** Items in the menu. */
  items: ActionBarMenuItemProps[]
  /** Icon shown beside the menu's label in the "More items" menu, or `'none'` to omit it. Defaults to `icon`. */
  overflowIcon?: IconSource | 'none'
  /** Element that receives focus when the menu closes. Defaults to the trigger. */
  returnFocusRef?: React.RefObject<HTMLElement | null>
}
const Menu = React.forwardRef<HTMLButtonElement, ActionBarMenuProps>(function ActionBarMenu(
  {'aria-label': ariaLabel, icon, items, overflowIcon, returnFocusRef, ...props},
  ref,
) {
  const [element, setElement] = React.useState<HTMLButtonElement | null>(null)
  const isOverflowing = useActionBarItem(element, {
    type: 'menu',
    label: ariaLabel,
    icon: overflowIcon ?? icon,
    items,
    returnFocusRef,
  })
  return (
    <ActionMenu>
      <MenuTrigger
        {...props}
        ref={mergeRefs(ref, setElement)}
        aria-label={ariaLabel}
        data-component="ActionBar.Menu.IconButton"
        icon={icon}
        isOverflowing={isOverflowing}
      />
      <ActionMenu.Content sideOffset={4} finalFocus={returnFocusRef}>
        {items.map(renderMenuItem)}
      </ActionMenu.Content>
    </ActionMenu>
  )
})

export const ActionBar = Object.assign(Root, {Button, IconButton, Group, Divider, Menu})
Root.displayName = 'ActionBar'
