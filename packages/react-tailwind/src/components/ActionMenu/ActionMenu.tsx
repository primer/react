'use client'

import {CheckIcon, ChevronRightIcon, TriangleDownIcon} from '@primer/octicons-react'
import {Menu} from '@base-ui/react/menu'
import React from 'react'
import {createPortal} from 'react-dom'
import {cn} from '../../internal/cn'
import {getDisabledActivationHandlers, guardDisabledRender} from '../../internal/disabledActivation'
import {mergeClassName} from '../../internal/mergeClassName'
import {NarrowFullscreenCloseButton} from '../../internal/NarrowFullscreenCloseButton'
import {
  isNarrowFullscreen,
  narrowFullscreenPopupClassName,
  narrowFullscreenPositionerClassName,
} from '../../internal/narrowFullscreen'
import {overlayAvailableWidthClassName, overlaySizeClassName} from '../../internal/overlaySize'
import {FloatingPortal} from '../../internal/FloatingPortal'
import {FloatingPortalParentContext, useFloatingPortalContainer} from '../../internal/portalRoot'
import {mergeRefs} from '../../internal/refs'
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
import {ActionMenuActionsContext, ActionMenuListContext, ActionMenuSubmenuContext} from './ActionMenuContext'
const triggerClassName =
  'primer:inline-flex primer:min-h-8 primer:items-center primer:justify-center primer:gap-2 primer:rounded-md primer:border-thin primer:border-default primer:bg-default primer:px-3 primer:text-sm primer:font-semibold primer:text-default primer:hover:bg-muted primer:focus-visible:outline-2 primer:focus-visible:outline-offset-2 primer:focus-visible:outline-focus primer:disabled:cursor-not-allowed primer:disabled:text-disabled'

export type ActionMenuRootProps = Menu.Root.Props

function Root({actionsRef, ...rest}: ActionMenuRootProps) {
  const ownActionsRef = React.useRef<Menu.Root.Actions | null>(null)
  const menuActionsRef = actionsRef ?? ownActionsRef
  return (
    <ActionMenuSubmenuContext.Provider value={null}>
      <ActionMenuActionsContext.Provider value={menuActionsRef}>
        <Menu.Root {...rest} actionsRef={menuActionsRef} />
      </ActionMenuActionsContext.Provider>
    </ActionMenuSubmenuContext.Provider>
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
  /**
   * Trailing visual for the trigger; pass `null` to remove it.
   * @default TriangleDownIcon
   */
  trailingAction?: ButtonProps['trailingAction']
}

const ButtonTrigger = React.forwardRef<HTMLButtonElement, ActionMenuButtonProps>(function ActionMenuButton(
  {children, className, disabled, id, loading, size = 'medium', trailingAction = TriangleDownIcon, ...buttonProps},
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
          trailingAction={trailingAction}
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
  /**
   * How the menu avoids collisions on the side and alignment axes. Horizontal menus fall back to the perpendicular
   * axis by default when neither horizontal side fits.
   */
  collisionAvoidance?: Menu.Positioner.Props['collisionAvoidance']
  /** Element or rectangle used to constrain the menu's position. */
  collisionBoundary?: Menu.Positioner.Props['collisionBoundary']
  /** Space to keep between the menu and its collision boundary. */
  collisionPadding?: Menu.Positioner.Props['collisionPadding']
  /** Portal destination. Pass `null` to wait for a container; ignored when `portal` is false. */
  container?: Menu.Portal.Props['container']
  /** CSS positioning method for the positioner. */
  positionMethod?: Menu.Positioner.Props['positionMethod']
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
    collisionAvoidance,
    collisionBoundary,
    collisionPadding,
    container,
    finalFocus,
    height,
    maxHeight,
    maxWidth,
    portal = true,
    positionMethod,
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
  const submenu = React.useContext(ActionMenuSubmenuContext)
  const {positioner: parentPositioner} = React.useContext(ActionMenuListContext)
  const [positioner, setPositioner] = React.useState<HTMLDivElement | null>(null)
  const popupRef = React.useRef<HTMLDivElement | null>(null)
  const closeRef = React.useRef<HTMLElement | null>(null)
  const closeWasFocused = React.useRef(false)
  const setPopupRef = React.useMemo(() => mergeRefs(ref, popupRef), [ref])
  const fullscreen = isNarrowFullscreen(variant)
  const horizontalSide = side === 'left' || side === 'right' || side === 'inline-start' || side === 'inline-end'
  const resolvedCollisionAvoidance = horizontalSide
    ? {...collisionAvoidance, fallbackAxisSide: collisionAvoidance?.fallbackAxisSide ?? 'end'}
    : collisionAvoidance

  React.useEffect(() => {
    if (!fullscreen || typeof window.matchMedia !== 'function') return
    const wide = window.matchMedia('(min-width: 768px)')
    const handleChange = (event: MediaQueryListEvent) => {
      const popup = popupRef.current
      const close = closeRef.current
      if (!event.matches || !popup || !close || !closeWasFocused.current) return
      closeWasFocused.current = false
      const activeElement = close.ownerDocument.activeElement
      if (activeElement !== close && activeElement !== popup && activeElement !== close.ownerDocument.body) return
      const items = popup.querySelectorAll<HTMLElement>(
        '[role="menuitem"],[role="menuitemcheckbox"],[role="menuitemradio"]',
      )
      const target = Array.from(items).find(
        item =>
          item !== close &&
          item.closest('[role="menu"]') === popup &&
          !item.matches(':disabled') &&
          !item.closest('[aria-hidden="true"]') &&
          item.getClientRects().length > 0,
      )
      ;(target ?? popup).focus()
    }
    wide.addEventListener('change', handleChange)
    return () => wide.removeEventListener('change', handleChange)
  }, [fullscreen])

  return (
    <FloatingPortal container={container} owner={submenu?.owner} part={Portal} portal={portal}>
      <Menu.Positioner
        ref={setPositioner}
        align={align}
        alignOffset={alignOffset}
        anchor={anchor}
        collisionAvoidance={resolvedCollisionAvoidance}
        collisionBoundary={collisionBoundary}
        collisionPadding={collisionPadding}
        positionMethod={positionMethod}
        side={side}
        sideOffset={sideOffset}
        className={cn(
          'primer:z-popover primer:grid primer:grid-cols-[fit-content(var(--available-width,100vw))]',
          fullscreen && [narrowFullscreenPositionerClassName, 'primer:max-md:pt-9'],
          positionerClassName,
        )}
        data-component="ActionMenu.Positioner"
        data-responsive={fullscreen ? 'fullscreen' : undefined}
      >
        <Menu.Popup
          {...rest}
          // An explicit undefined clears Base UI's automatic trigger label; an omitted prop would keep it.
          {...(rest['aria-label'] !== undefined && rest['aria-labelledby'] === undefined
            ? {'aria-labelledby': undefined}
            : {})}
          ref={setPopupRef}
          finalFocus={preventFocusOnClose ? false : finalFocus}
          className={mergeClassName(
            cn(
              'primer:box-border primer:max-h-[var(--available-height)] primer:min-w-[min(--spacing(48),var(--available-width,100vw))] primer:overflow-y-auto primer:rounded-lg primer:bg-[var(--overlay-bgColor)] primer:py-2 primer:shadow-floating-sm primer:outline-none primer:contrast-more:border-thin primer:contrast-more:border-current primer:data-[closed]:hidden',
              overlaySizeClassName({height, maxHeight, maxWidth}),
              overlayAvailableWidthClassName(width),
              fullscreen && narrowFullscreenPopupClassName,
            ),
            className,
          )}
          data-component="ActionMenu.Content"
          data-dividers={showDividers || undefined}
        >
          <ActionMenuListContext.Provider value={{positioner: submenu ? parentPositioner : positioner, showDividers}}>
            {fullscreen ? (
              <Menu.Item
                nativeButton
                closeOnClick={false}
                onBlur={event => {
                  const isWide =
                    typeof window.matchMedia === 'function' && window.matchMedia('(min-width: 768px)').matches
                  if (event.relatedTarget || !isWide) {
                    closeWasFocused.current = false
                  }
                }}
                onClick={() => actionsRef?.current?.close()}
                onFocus={() => {
                  closeWasFocused.current = true
                }}
                render={<NarrowFullscreenCloseButton data-component="ActionMenu.CloseButton" ref={closeRef} />}
              />
            ) : null}
            {children}
          </ActionMenuListContext.Provider>
        </Menu.Popup>
      </Menu.Positioner>
    </FloatingPortal>
  )
})

function Portal({children, container, ...rest}: Menu.Portal.Props) {
  const portalContainer = useFloatingPortalContainer(container)
  return (
    <Menu.Portal {...rest} container={portalContainer}>
      <FloatingPortalParentContext.Provider value>{children}</FloatingPortalParentContext.Provider>
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
    'primer:box-border primer:mx-2 primer:!w-[calc(100%-1rem)] primer:focus-visible:outline-offset-0',
    getActionItemStateClassName(state),
  )
}

/**
 * Menu rows are siblings rather than list items, so a row draws its divider only when it directly follows another
 * row. Group labels and dividers break the run, and a highlighted row hides the dividers on both of its edges.
 */
const menuItemDividerClassName = cn(
  "primer:relative primer:before:absolute primer:before:inset-x-0 primer:before:-top-[7px] primer:before:hidden primer:before:h-px primer:before:bg-[var(--borderColor-muted)] primer:before:content-['']",
  'primer:[[role^=menuitem]:not([data-highlighted])+[role^=menuitem]:not([data-highlighted])>&]:before:block',
)

function MenuItemContent({
  loading,
  selected,
  selection,
  ...props
}: Omit<React.ComponentProps<typeof ActionItemContent>, 'dividerClassName' | 'indicator' | 'showDivider'> & {
  loading?: boolean
  selected?: boolean
}) {
  const {showDividers} = React.useContext(ActionMenuListContext)
  return (
    <ActionItemContent
      {...props}
      dividerClassName={menuItemDividerClassName}
      indicator={loading ? <Spinner aria-hidden="true" className="primer:shrink-0" size="small" srText={null} /> : null}
      selection={
        selected === undefined ? (
          selection
        ) : (
          <CheckIcon
            aria-hidden="true"
            className={cn('primer:size-4 primer:shrink-0', !selected && 'primer:invisible')}
          />
        )
      }
      showDivider={showDividers}
    />
  )
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
  {
    'aria-describedby': describedBy,
    'aria-label': ariaLabel,
    'aria-labelledby': labelledBy,
    children,
    className,
    disabled,
    inactiveText,
    loading = false,
    loadingText,
    onAuxClickCapture,
    onClickCapture,
    onKeyDownCapture,
    onKeyUpCapture,
    render,
    selected,
    title,
    variant = 'default',
    ...rest
  },
  ref,
) {
  const state = {disabled, inactive: Boolean(inactiveText), loading, variant}
  const accessibility = ActionItemContent.useAccessibility({
    describedBy,
    label: ariaLabel,
    labelledBy,
    loadingText: loading ? loadingText : undefined,
    render,
    resolveContent: id => ActionItemContent.resolve({children}, id),
    supportingText: inactiveText,
  })

  return (
    <Menu.Item
      {...rest}
      {...getActionItemStateAttributes(state)}
      ref={ref}
      aria-describedby={accessibility.describedBy}
      aria-label={ariaLabel}
      aria-labelledby={accessibility.labelledBy}
      disabled={disabled || Boolean(inactiveText) || loading}
      {...getDisabledActivationHandlers(Boolean(disabled || inactiveText || loading), {
        onAuxClickCapture,
        onClickCapture,
        onKeyDownCapture,
        onKeyUpCapture,
      })}
      render={guardDisabledRender(Boolean(disabled || inactiveText || loading), accessibility.render)}
      title={title ?? (typeof inactiveText === 'string' ? inactiveText : undefined)}
      className={mergeClassName(menuItemClassName(state), className)}
      data-component="ActionMenu.Item"
      data-selected={selected || undefined}
    >
      <MenuItemContent
        loading={loading}
        resolvedContent={accessibility.resolvedContent}
        selected={selected}
        supportingText={inactiveText}
        supportingTextId={accessibility.supportingTextId}
      />
      {loading && loadingText ? (
        <span className="primer:sr-only" id={accessibility.loadingTextId}>
          {loadingText}
        </span>
      ) : null}
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
  {
    'aria-describedby': describedBy,
    'aria-label': ariaLabel,
    'aria-labelledby': labelledBy,
    children,
    className,
    closeOnClick = true,
    href,
    id,
    inactiveText,
    label,
    render,
    style,
    title,
    variant = 'default',
    ...rest
  },
  ref,
) {
  const accessibility = ActionItemContent.useAccessibility({
    describedBy,
    label: ariaLabel,
    labelledBy,
    render,
    resolveContent: id => ActionItemContent.resolve({children}, id),
  })
  if (inactiveText) {
    // Keep an anchor ref without allowing navigation or rendering the caller's potentially interactive link.
    return (
      <Item
        aria-describedby={describedBy}
        aria-label={ariaLabel}
        aria-labelledby={labelledBy}
        className={className}
        id={id}
        inactiveText={inactiveText}
        label={label}
        // The item provides the anchor's children.
        // eslint-disable-next-line jsx-a11y/anchor-has-content
        render={<a {...rest} aria-disabled="true" data-component="ActionMenu.LinkItem" ref={ref} />}
        style={style}
        title={title}
        variant={variant}
      >
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
      {...(href !== undefined ? {href} : {})}
      aria-describedby={accessibility.describedBy}
      aria-label={ariaLabel}
      aria-labelledby={accessibility.labelledBy}
      closeOnClick={closeOnClick}
      label={label}
      render={accessibility.render}
      style={style}
      title={title}
      className={mergeClassName(menuItemClassName({variant}), className)}
      data-component="ActionMenu.LinkItem"
    >
      <MenuItemContent resolvedContent={accessibility.resolvedContent} />
    </Menu.LinkItem>
  )
})

/** Menus mark checked checkbox and radio items with a checkmark, as menu selections do in Primer. */
const checkedItemIndicator = (
  <CheckIcon
    aria-hidden="true"
    className="primer:size-4 primer:shrink-0 primer:invisible primer:group-data-[checked]:visible"
  />
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
  {
    'aria-describedby': describedBy,
    'aria-label': ariaLabel,
    'aria-labelledby': labelledBy,
    children,
    className,
    closeOnClick = true,
    disabled,
    onAuxClickCapture,
    onClickCapture,
    onKeyDownCapture,
    onKeyUpCapture,
    render,
    ...rest
  },
  ref,
) {
  const accessibility = ActionItemContent.useAccessibility({
    describedBy,
    label: ariaLabel,
    labelledBy,
    render,
    resolveContent: id => ActionItemContent.resolve({children}, id),
  })
  return (
    <Menu.CheckboxItem
      {...rest}
      ref={ref}
      aria-describedby={accessibility.describedBy}
      aria-label={ariaLabel}
      aria-labelledby={accessibility.labelledBy}
      closeOnClick={closeOnClick}
      disabled={disabled}
      {...getDisabledActivationHandlers(Boolean(disabled), {
        onAuxClickCapture,
        onClickCapture,
        onKeyDownCapture,
        onKeyUpCapture,
      })}
      render={guardDisabledRender(Boolean(disabled), accessibility.render)}
      className={mergeClassName(cn('primer:group', menuItemClassName({disabled})), className)}
      data-component="ActionMenu.CheckboxItem"
    >
      <MenuItemContent resolvedContent={accessibility.resolvedContent} selection={checkedItemIndicator} />
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
  {
    'aria-describedby': describedBy,
    'aria-label': ariaLabel,
    'aria-labelledby': labelledBy,
    children,
    className,
    closeOnClick = true,
    disabled,
    onAuxClickCapture,
    onClickCapture,
    onKeyDownCapture,
    onKeyUpCapture,
    render,
    ...rest
  },
  ref,
) {
  const accessibility = ActionItemContent.useAccessibility({
    describedBy,
    label: ariaLabel,
    labelledBy,
    render,
    resolveContent: id => ActionItemContent.resolve({children}, id),
  })
  return (
    <Menu.RadioItem
      {...rest}
      ref={ref}
      aria-describedby={accessibility.describedBy}
      aria-label={ariaLabel}
      aria-labelledby={accessibility.labelledBy}
      closeOnClick={closeOnClick}
      disabled={disabled}
      {...getDisabledActivationHandlers(Boolean(disabled), {
        onAuxClickCapture,
        onClickCapture,
        onKeyDownCapture,
        onKeyUpCapture,
      })}
      render={guardDisabledRender(Boolean(disabled), accessibility.render)}
      className={mergeClassName(cn('primer:group', menuItemClassName({disabled})), className)}
      data-component="ActionMenu.RadioItem"
    >
      <MenuItemContent resolvedContent={accessibility.resolvedContent} selection={checkedItemIndicator} />
    </Menu.RadioItem>
  )
})

function Submenu({children, ...props}: Menu.SubmenuRoot.Props) {
  const {positioner} = React.useContext(ActionMenuListContext)
  const [owner, setOwner] = React.useState<HTMLDivElement | null>(null)

  return (
    <ActionMenuSubmenuContext.Provider value={{owner}}>
      <Menu.SubmenuRoot {...props}>
        {children}
        {positioner ? createPortal(<div ref={setOwner} className="primer:contents" />, positioner) : null}
      </Menu.SubmenuRoot>
    </ActionMenuSubmenuContext.Provider>
  )
}

export interface ActionMenuSubmenuTriggerProps
  extends Omit<Menu.SubmenuTrigger.Props, 'data-component'>,
    Pick<ActionMenuItemProps, 'inactiveText' | 'loading' | 'loadingText' | 'variant'> {
  /** Shows the current-choice indicator without changing selection when the submenu opens. Does not set an ARIA checked state. */
  selected?: boolean
}
const SubmenuTrigger = React.forwardRef<HTMLElement, ActionMenuSubmenuTriggerProps>(function ActionMenuSubmenuTrigger(
  {
    'aria-describedby': describedBy,
    'aria-label': ariaLabel,
    'aria-labelledby': labelledBy,
    children,
    className,
    disabled,
    inactiveText,
    loading = false,
    loadingText,
    onAuxClickCapture,
    onClickCapture,
    onKeyDownCapture,
    onKeyUpCapture,
    render,
    selected,
    variant = 'default',
    ...rest
  },
  ref,
) {
  const unavailable = Boolean(disabled || inactiveText || loading)
  const state = {disabled, inactive: Boolean(inactiveText), loading, variant}
  const accessibility = ActionItemContent.useAccessibility({
    describedBy,
    label: ariaLabel,
    labelledBy,
    loadingText: loading ? loadingText : undefined,
    render,
    resolveContent: id => {
      const content = ActionItemContent.resolve({children}, id)
      return ActionItemContent.resolveParts(
        {
          ...content,
          trailingVisual: (
            // eslint-disable-next-line primer-react/direct-slot-children -- ActionItemContent owns the shared item layout.
            <ActionList.TrailingVisual>
              {content.trailingVisual}
              <ChevronRightIcon aria-hidden="true" />
            </ActionList.TrailingVisual>
          ),
        },
        id,
      )
    },
    supportingText: inactiveText,
  })

  return (
    <Menu.SubmenuTrigger
      {...rest}
      {...getActionItemStateAttributes(state)}
      ref={ref}
      aria-describedby={accessibility.describedBy}
      aria-label={ariaLabel}
      aria-labelledby={accessibility.labelledBy}
      disabled={unavailable}
      render={guardDisabledRender(unavailable, accessibility.render)}
      {...getDisabledActivationHandlers(unavailable, {
        onAuxClickCapture,
        onClickCapture,
        onKeyDownCapture,
        onKeyUpCapture,
      })}
      className={mergeClassName(
        cn(
          menuItemClassName(state),
          // The trigger stays filled while its submenu is open, so the path to the submenu is visible.
          'primer:data-[popup-open]:bg-[var(--control-transparent-bgColor-hover)]',
        ),
        className,
      )}
      data-component="ActionMenu.SubmenuTrigger"
      data-selected={selected || undefined}
    >
      <MenuItemContent
        loading={loading}
        resolvedContent={accessibility.resolvedContent}
        selected={selected}
        supportingText={inactiveText}
        supportingTextId={accessibility.supportingTextId}
      />
      {loading && loadingText ? (
        <span className="primer:sr-only" id={accessibility.loadingTextId}>
          {loadingText}
        </span>
      ) : null}
    </Menu.SubmenuTrigger>
  )
})

/** Adjacent groups, including radio groups, are spaced apart as ActionList groups are. */
const groupClassName = 'primer:[&+&]:mt-2'

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
        'primer:flex primer:min-h-[30px] primer:items-center primer:px-4 primer:py-1.5 primer:text-xs primer:leading-[18px] primer:font-semibold primer:text-muted',
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
  Submenu,
  SubmenuTrigger,
  LeadingVisual: ActionList.LeadingVisual,
  TrailingVisual: ActionList.TrailingVisual,
  Description: ActionList.Description,
})
;(ActionMenu as {displayName?: string}).displayName = 'ActionMenu'
