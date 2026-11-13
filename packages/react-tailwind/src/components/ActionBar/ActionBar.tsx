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
  OverflowAnchorContext,
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
type OverflowItemFocus = (element: Element, returnFocusRef?: React.RefObject<HTMLElement | null>) => void

const ActionBarContext = React.createContext<ControlSize>('medium')
const ActionBarRegistryContext = React.createContext<RegisterOverflowItem<OverflowEntry> | null>(null)
const ActionBarFocusContext = React.createContext<((element: Element) => void) | null>(null)
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

function useActionBarClipping(element: Element | null, disabled: boolean) {
  const onItemClipped = React.useContext(ActionBarFocusContext)
  const onChange = React.useCallback(
    (clipped: boolean) => {
      if (clipped && element) onItemClipped?.(element)
    },
    [element, onItemClipped],
  )
  return useIsClipped(element, disabled, onChange)
}

/**
 * Tracks whether an item is clipped out of the bar and, while it is, registers it with the "More items" menu. Items in
 * a group follow the group, which overflows as a whole.
 */
function useActionBarItem(element: Element | null, entry: OverflowEntry) {
  const register = React.useContext(ActionBarRegistryContext)
  const isGroupOverflowing = React.useContext(ActionBarGroupContext)
  const isClipped = useActionBarClipping(element, isGroupOverflowing !== null)
  const isOverflowing = isGroupOverflowing === true || isClipped
  useRegisterOverflowItem(register, element, isOverflowing ? entry : null)
  return isOverflowing
}

/** Keeps render-chain handler changes from continuously updating the overflow registry. */
function useOverflowClick(onClick: React.MouseEventHandler<HTMLElement> | undefined) {
  const latestClick = React.useRef(onClick)
  React.useLayoutEffect(() => {
    latestClick.current = onClick
  })
  const handleClick = React.useCallback<React.MouseEventHandler<HTMLElement>>(event => {
    latestClick.current?.(event)
  }, [])
  return onClick ? handleClick : undefined
}

function renderMenuItem(item: ActionBarMenuItemProps, index: number, onReturnFocus?: () => boolean): React.ReactNode {
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
        <ActionMenu.Content side="right" finalFocus={onReturnFocus}>
          {items.map((child, childIndex) => renderMenuItem(child, childIndex, onReturnFocus))}
        </ActionMenu.Content>
      </ActionMenu.Submenu>
    )
  }

  return (
    <ActionMenu.Item key={`${index}-${label}`} disabled={disabled} label={label} onClick={onClick} variant={variant}>
      {content}
    </ActionMenu.Item>
  )
}

function renderOverflowEntry(
  [id, {element, entry}]: [string, OverflowItem<OverflowEntry>],
  onItemFocus: OverflowItemFocus,
  onSubmenuReturnFocus: () => boolean,
): React.ReactNode {
  if (entry.type === 'divider') return <ActionMenu.Divider key={id} />

  const visual =
    entry.icon && entry.icon !== 'none' ? (
      <ActionMenu.LeadingVisual>{renderIcon(entry.icon)}</ActionMenu.LeadingVisual>
    ) : null

  if (entry.type === 'menu') {
    return (
      <ActionMenu.Submenu key={id}>
        <ActionMenu.SubmenuTrigger label={entry.label} onFocusCapture={() => onItemFocus(element)}>
          {visual}
          {entry.label}
        </ActionMenu.SubmenuTrigger>
        <ActionMenu.Content
          side="right"
          finalFocus={entry.returnFocusRef ?? onSubmenuReturnFocus}
          onFocusCapture={() => onItemFocus(element, entry.returnFocusRef)}
        >
          {entry.items.map((item, index) => renderMenuItem(item, index, onSubmenuReturnFocus))}
        </ActionMenu.Content>
      </ActionMenu.Submenu>
    )
  }

  return (
    <ActionMenu.Item
      key={id}
      disabled={entry.disabled}
      onClick={entry.onClick}
      onFocusCapture={() => onItemFocus(element)}
    >
      {visual}
      {entry.label}
    </ActionMenu.Item>
  )
}

interface MenuTriggerProps extends Omit<IconButtonProps, 'aria-label' | 'data-component' | 'variant'> {
  'aria-label': string
  'data-component': string
  isOverflowing?: boolean
}

/** An icon button that is both a toolbar item and an ActionMenu trigger. */
const MenuTrigger = React.forwardRef<HTMLButtonElement, MenuTriggerProps>(function ActionBarMenuTrigger(
  {
    'aria-disabled': ariaDisabled,
    'aria-hidden': ariaHidden,
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
      aria-disabled={disabled || isOverflowing ? true : ariaDisabled}
      aria-hidden={isOverflowing ? true : ariaHidden}
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

function OverflowMenu({
  entries,
  onBlurCapture,
  onFocusCapture,
  onItemFocus,
  onReturnFocus,
  onSubmenuReturnFocus,
  onUnmount,
  popupRef,
  triggerRef,
}: {
  entries: OverflowEntries
  onBlurCapture: React.FocusEventHandler<HTMLDivElement>
  onFocusCapture: React.FocusEventHandler<HTMLDivElement>
  onItemFocus: OverflowItemFocus
  onReturnFocus: () => boolean
  onSubmenuReturnFocus: () => boolean
  onUnmount: () => void
  popupRef: React.RefObject<HTMLDivElement | null>
  triggerRef: React.RefObject<HTMLButtonElement | null>
}) {
  React.useLayoutEffect(() => onUnmount, [onUnmount])
  return (
    <ActionMenu>
      <MenuTrigger
        ref={triggerRef}
        aria-label="More items"
        data-component="ActionBar.MoreButton"
        icon={KebabHorizontalIcon}
      />
      <ActionMenu.Content
        ref={popupRef}
        sideOffset={4}
        onBlurCapture={onBlurCapture}
        onFocusCapture={onFocusCapture}
        finalFocus={onReturnFocus}
      >
        {entries.map(entry => renderOverflowEntry(entry, onItemFocus, onSubmenuReturnFocus))}
      </ActionMenu.Content>
    </ActionMenu>
  )
}

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

  const moreTriggerRef = React.useRef<HTMLButtonElement | null>(null)
  const morePopupRef = React.useRef<HTMLDivElement | null>(null)
  const overflowFocusRef = React.useRef<HTMLElement | null>(null)
  const overflowReturnFocusRef = React.useRef<React.RefObject<HTMLElement | null> | undefined>(undefined)
  const pendingFocusRef = React.useRef<HTMLElement | null>(null)
  const previousFocusRef = React.useRef<HTMLElement | null>(null)
  // React capture events include portaled submenus that the outer popup does not contain.
  const handleOverflowFocus = React.useCallback<React.FocusEventHandler<HTMLDivElement>>(event => {
    if (event.target instanceof HTMLElement) overflowFocusRef.current = event.target
  }, [])
  const handleOverflowBlur = React.useCallback(() => {
    overflowFocusRef.current = null
    overflowReturnFocusRef.current = undefined
  }, [])
  const handleOverflowItemFocus = React.useCallback<OverflowItemFocus>((element, returnFocusRef) => {
    if (element instanceof HTMLElement) previousFocusRef.current = element
    overflowReturnFocusRef.current = returnFocusRef
  }, [])
  const handleSubmenuReturnFocus = React.useCallback(() => {
    const trigger = moreTriggerRef.current
    if (!trigger?.isConnected) return false
    const activeElement = trigger.ownerDocument.activeElement
    // A callback is explicit to Base UI, so retain automatic dismissal's outside-focus guard.
    return (
      activeElement === trigger.ownerDocument.body ||
      activeElement === trigger ||
      !!morePopupRef.current?.contains(activeElement) ||
      activeElement === overflowFocusRef.current
    )
  }, [])
  const handleOverflowReturnFocus = React.useCallback(() => {
    if (overflowReturnFocusRef.current?.current?.isConnected) return false
    return handleSubmenuReturnFocus()
  }, [handleSubmenuReturnFocus])
  const handleItemClipped = React.useCallback((element: Element) => {
    const activeElement = element.ownerDocument.activeElement
    if (!(activeElement instanceof HTMLElement) || !element.contains(activeElement)) return
    previousFocusRef.current = activeElement
    if (moreTriggerRef.current) moreTriggerRef.current.focus()
    else pendingFocusRef.current = activeElement
  }, [])

  React.useLayoutEffect(() => {
    const previousFocus = pendingFocusRef.current
    if (!hasOverflow || !previousFocus || !moreTriggerRef.current) return
    const activeElement = previousFocus.ownerDocument.activeElement
    if (activeElement === previousFocus || activeElement === previousFocus.ownerDocument.body) {
      moreTriggerRef.current.focus()
    }
    pendingFocusRef.current = null
  }, [hasOverflow])

  const handleOverflowUnmount = React.useCallback(() => {
    const trigger = moreTriggerRef.current
    const popup = morePopupRef.current
    const overflowFocus = overflowFocusRef.current
    const returnFocusRef = overflowReturnFocusRef.current
    overflowFocusRef.current = null
    overflowReturnFocusRef.current = undefined
    const activeElement = toolbar?.ownerDocument.activeElement
    const hadOverflowFocus =
      activeElement === trigger ||
      (activeElement && popup?.contains(activeElement)) ||
      (overflowFocus &&
        (activeElement === overflowFocus ||
          (activeElement === toolbar?.ownerDocument.body && !overflowFocus.isConnected)))
    if (!hadOverflowFocus || !toolbar || !trigger) return

    queueMicrotask(() => {
      if (trigger.isConnected) return
      const currentFocus = toolbar.ownerDocument.activeElement
      if (
        currentFocus !== toolbar.ownerDocument.body &&
        currentFocus !== trigger &&
        currentFocus !== overflowFocus &&
        !popup?.contains(currentFocus)
      ) {
        return
      }
      const previousFocus = previousFocusRef.current
      previousFocusRef.current = null
      pendingFocusRef.current = null
      // The submenu's Base UI focus manager owns an explicit return target.
      if (returnFocusRef?.current?.isConnected) return
      const canFocus = (element: HTMLElement) =>
        element.isConnected &&
        toolbar.contains(element) &&
        !element.matches(':disabled,[data-overflowing]') &&
        !element.closest('[aria-hidden="true"]')
      const fallback = Array.from(toolbar.querySelectorAll<HTMLElement>('[data-focusable]:not([data-disabled])')).find(
        element => element !== trigger && canFocus(element),
      )
      const target = previousFocus && canFocus(previousFocus) ? previousFocus : fallback
      target?.focus()
    })
  }, [toolbar])

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
        className={cn(
          'primer:flex primer:items-center primer:justify-end primer:px-[var(--base-size-16)]',
          flush && 'primer:px-0',
          className,
        )}
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
            'primer:group primer:relative primer:-mb-px primer:flex primer:h-8 primer:min-w-0 primer:items-start primer:overflow-hidden primer:[contain:layout] primer:data-[size=small]:h-7 primer:data-[size=large]:h-10',
            gap === 'condensed' && 'primer:gap-2',
          )}
        >
          <div className="primer:flex primer:flex-wrap primer:justify-end primer:gap-[inherit] primer:overflow-hidden primer:[contain:layout]">
            {/* An empty first item lets even the first real item wrap onto the clipped second line. */}
            <div
              aria-hidden="true"
              className="primer:h-8 primer:group-data-[size=small]:h-7 primer:group-data-[size=large]:h-10"
            />
            <OverflowObserverProvider root={toolbar}>
              <ActionBarRegistryContext.Provider value={register}>
                <ActionBarFocusContext.Provider value={handleItemClipped}>
                  <OverflowAnchorContext.Provider
                    value={{items: overflowItems.map(([, item]) => item.element), triggerRef: moreTriggerRef}}
                  >
                    {children}
                  </OverflowAnchorContext.Provider>
                </ActionBarFocusContext.Provider>
              </ActionBarRegistryContext.Provider>
            </OverflowObserverProvider>
          </div>
          {hasOverflow ? (
            <OverflowMenu
              entries={overflowEntries}
              onBlurCapture={handleOverflowBlur}
              onFocusCapture={handleOverflowFocus}
              onItemFocus={handleOverflowItemFocus}
              onReturnFocus={handleOverflowReturnFocus}
              onSubmenuReturnFocus={handleSubmenuReturnFocus}
              onUnmount={handleOverflowUnmount}
              popupRef={morePopupRef}
              triggerRef={moreTriggerRef}
            />
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
  const elementRef = React.useMemo(() => mergeRefs(ref, setElement), [ref])
  const overflowClick = useOverflowClick(onClick as React.MouseEventHandler<HTMLElement> | undefined)
  const isOverflowing = useActionBarItem(element, {
    type: 'action',
    label: children,
    icon:
      leadingVisual && (isIconComponent(leadingVisual) || React.isValidElement(leadingVisual))
        ? leadingVisual
        : undefined,
    disabled,
    onClick: overflowClick,
  })
  return (
    <Toolbar.Button
      {...props}
      ref={elementRef}
      aria-disabled={disabled || isOverflowing ? true : props['aria-disabled']}
      aria-hidden={isOverflowing ? true : props['aria-hidden']}
      disabled={disabled || isOverflowing}
      focusableWhenDisabled={!isOverflowing}
      onClick={onClick}
      render={
        <SharedButton
          data-component="ActionBar.Button"
          focusableWhenDisabled={!isOverflowing}
          leadingVisual={leadingVisual}
          size={size}
          variant="invisible"
        />
      }
      data-component="ActionBar.Button"
      data-overflowing={isOverflowing || undefined}
      className={className}
    >
      {children}
    </Toolbar.Button>
  )
})

export type ActionBarIconButtonProps = Omit<IconButtonProps, 'aria-label' | 'data-component' | 'size' | 'variant'> & {
  /** Accessible name, also used as the label when the action overflows. */
  'aria-label': string
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
  const elementRef = React.useMemo(() => mergeRefs(ref, setElement), [ref])
  const overflowClick = useOverflowClick(onClick as React.MouseEventHandler<HTMLElement> | undefined)
  const isOverflowing = useActionBarItem(element, {
    type: 'action',
    label: ariaLabel,
    icon,
    disabled,
    onClick: overflowClick,
  })
  return (
    <Toolbar.Button
      {...props}
      ref={elementRef}
      aria-disabled={disabled || isOverflowing ? true : props['aria-disabled']}
      aria-hidden={isOverflowing ? true : props['aria-hidden']}
      aria-label={ariaLabel}
      disabled={disabled || isOverflowing}
      focusableWhenDisabled={!isOverflowing}
      onClick={onClick}
      render={
        <SharedIconButton
          aria-label={ariaLabel}
          data-component="ActionBar.IconButton"
          focusableWhenDisabled={!isOverflowing}
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
  const elementRef = React.useMemo(() => mergeRefs(ref, setElement), [ref])
  const isParentOverflowing = React.useContext(ActionBarGroupContext)
  const isClipped = useActionBarClipping(element, isParentOverflowing !== null)
  const isOverflowing = isParentOverflowing === true || isClipped
  return (
    <ActionBarGroupContext.Provider value={isOverflowing}>
      <Toolbar.Group
        {...props}
        ref={elementRef}
        aria-hidden={isOverflowing ? true : props['aria-hidden']}
        data-component="ActionBar.Group"
        data-overflowing={isOverflowing || undefined}
        className={cn('primer:flex primer:gap-[inherit]', className)}
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
  const elementRef = React.useMemo(() => mergeRefs(ref, setElement), [ref])
  const isOverflowing = useActionBarItem(element, {type: 'divider'})
  return (
    <Toolbar.Separator
      {...props}
      ref={elementRef}
      aria-hidden={isOverflowing ? true : props['aria-hidden']}
      data-component="ActionBar.Divider"
      data-overflowing={isOverflowing || undefined}
      className={cn(
        'primer:h-5 primer:w-px primer:self-center primer:bg-muted primer:group-data-[gap=none]:mx-2',
        className,
      )}
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
  const elementRef = React.useMemo(() => mergeRefs(ref, setElement), [ref])
  const overflowAnchor = React.useContext(OverflowAnchorContext)
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
        ref={elementRef}
        aria-label={ariaLabel}
        data-component="ActionBar.Menu.IconButton"
        icon={icon}
        isOverflowing={isOverflowing}
      />
      <ActionMenu.Content
        anchor={isOverflowing ? overflowAnchor?.triggerRef : undefined}
        finalFocus={returnFocusRef ?? (isOverflowing ? overflowAnchor?.triggerRef : undefined)}
        sideOffset={4}
      >
        {items.map((item, index) => renderMenuItem(item, index))}
      </ActionMenu.Content>
    </ActionMenu>
  )
})

export const ActionBar = Object.assign(Root, {Button, IconButton, Group, Divider, Menu})
Root.displayName = 'ActionBar'
