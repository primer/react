import {type RefObject, type MouseEventHandler, useContext} from 'react'
import React, {useState, useCallback, useRef, forwardRef, useMemo, useSyncExternalStore} from 'react'
import {KebabHorizontalIcon} from '@primer/octicons-react'
import {ActionList, type ActionListItemProps} from '../ActionList'

import type {IconButtonProps} from '../Button'
import {IconButton} from '../Button'
import {ActionMenu} from '../ActionMenu'
import {useFocusZone, FocusKeys} from '../hooks/useFocusZone'
import styles from './ActionBar.module.css'
import {clsx} from 'clsx'
import {useRefObjectAsForwardedRef} from '../hooks'
import {createDescendantRegistry} from '../utils/descendant-registry'

type ChildProps =
  | {
      type: 'action'
      label: string
      disabled: boolean
      icon: ActionBarIconButtonProps['icon']
      onClick: MouseEventHandler
    }
  | {type: 'divider' | 'group'}
  | {
      type: 'menu'
      label: string
      icon: ActionBarIconButtonProps['icon'] | 'none'
      items: ActionBarMenuProps['items']
      returnFocusRef?: React.RefObject<HTMLElement>
    }

const ActionBarContext = React.createContext<{
  size: Size
  groupId?: string
}>({
  size: 'medium',
  groupId: undefined,
})

/*
small (28px), medium (32px), large (40px)
*/
type Size = 'small' | 'medium' | 'large'

type A11yProps =
  | {
      /** When provided, a label is added to the action bar */
      'aria-label': React.AriaAttributes['aria-label']
      'aria-labelledby'?: undefined
    }
  | {
      'aria-label'?: undefined
      /**
       * When provided, uses the element with that ID as the accessible name for the ActionBar
       */
      'aria-labelledby': React.AriaAttributes['aria-labelledby']
    }

type GapScale = 'none' | 'condensed'

export type ActionBarProps = {
  /**
   * Size of the action bar
   * @default 'medium'
   * */
  size?: Size

  /** Buttons in the action bar */
  children: React.ReactNode

  /**
   * Allows ActionBar to be flush with the container
   * @default false
   * */
  flush?: boolean

  /** Custom className */
  className?: string

  /**
   * Horizontal gap scale between items (mirrors Stack gap scale)
   * @default 'condensed'
   */
  gap?: GapScale
} & A11yProps

export type ActionBarIconButtonProps = {disabled?: boolean} & IconButtonProps

export type ActionBarMenuItemProps =
  | ({
      /**
       * Type of menu item to be rendered in the menu (action | group).
       * Defaults to 'action' if not specified.
       */
      type?: 'action'
      /**
       * Whether the menu item is disabled.
       * All interactions will be prevented if true.
       */
      disabled?: boolean
      /**
       * Leading visual rendered for the menu item.
       */
      leadingVisual?: ActionBarIconButtonProps['icon']
      /**
       * Trailing visual rendered for the menu item.
       */
      trailingVisual?: ActionBarIconButtonProps['icon'] | string
      /**
       * Label for the menu item.
       */
      label: string
      /**
       * Callback fired when the menu item is selected.
       */
      onClick?: ActionListItemProps['onSelect']
      /**
       * Nested menu items to render within a submenu.
       * If provided, the menu item will render a submenu.
       */
      items?: ActionBarMenuItemProps[]
    } & Pick<ActionListItemProps, 'variant'>)
  | {
      type: 'divider'
    }

export type ActionBarMenuProps = {
  /** Accessible label for the menu button */
  'aria-label': string
  /** Icon for the menu button */
  icon: ActionBarIconButtonProps['icon']
  items: ActionBarMenuItemProps[]
  /**
   * Icon displayed when the menu item is overflowing.
   * If 'none' is provided, no icon will be shown in the overflow menu.
   */
  overflowIcon?: ActionBarIconButtonProps['icon'] | 'none'
  /**
   * Target element to return focus to when the menu is closed.
   */
  returnFocusRef?: React.RefObject<HTMLElement>
} & IconButtonProps

const ActionBarItemsRegistry = createDescendantRegistry<ChildProps | null>()

const renderMenuItem = (item: ActionBarMenuItemProps, index: number): React.ReactNode => {
  if (item.type === 'divider') {
    return <ActionList.Divider key={index} />
  }

  const {label, onClick, disabled, trailingVisual: TrailingIcon, leadingVisual: LeadingIcon, items, variant} = item

  if (items && items.length > 0) {
    return (
      <ActionMenu key={label}>
        <ActionMenu.Anchor>
          <ActionList.Item disabled={disabled} variant={variant}>
            {LeadingIcon ? (
              <ActionList.LeadingVisual>
                <LeadingIcon />
              </ActionList.LeadingVisual>
            ) : null}
            {label}
            {TrailingIcon ? (
              <ActionList.TrailingVisual>
                {typeof TrailingIcon === 'string' ? <span>{TrailingIcon}</span> : <TrailingIcon />}
              </ActionList.TrailingVisual>
            ) : null}
          </ActionList.Item>
        </ActionMenu.Anchor>
        <ActionMenu.Overlay>
          <ActionList>{items.map((subItem, subIndex) => renderMenuItem(subItem, subIndex))}</ActionList>
        </ActionMenu.Overlay>
      </ActionMenu>
    )
  }

  return (
    <ActionList.Item key={label} onSelect={onClick} disabled={disabled} variant={variant}>
      {LeadingIcon ? (
        <ActionList.LeadingVisual>
          <LeadingIcon />
        </ActionList.LeadingVisual>
      ) : null}
      {label}
      {TrailingIcon ? (
        <ActionList.TrailingVisual>
          {typeof TrailingIcon === 'string' ? <span>{TrailingIcon}</span> : <TrailingIcon />}
        </ActionList.TrailingVisual>
      ) : null}
    </ActionList.Item>
  )
}

export const ActionBar: React.FC<React.PropsWithChildren<ActionBarProps>> = props => {
  const {
    size = 'medium',
    children,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    flush = false,
    className,
    gap = 'condensed',
  } = props

  // We derive the numeric gap from computed style so layout math stays in sync with CSS
  const listRef = useRef<HTMLDivElement>(null)

  const [childRegistry, setChildRegistry] = ActionBarItemsRegistry.useRegistryState()

  const navRef = useRef<HTMLDivElement>(null)

  useFocusZone({
    containerRef: listRef,
    bindKeys: FocusKeys.ArrowHorizontal | FocusKeys.HomeAndEnd,
    focusOutBehavior: 'wrap',
  })

  const overflowItems = Array.from(childRegistry?.entries() ?? []).filter(
    (entry): entry is [string, ChildProps] => entry[1] !== null,
  )

  return (
    <ActionBarContext.Provider value={{size}}>
      <div ref={navRef} className={clsx(className, styles.Nav)} data-flush={flush}>
        <div
          ref={listRef}
          role="toolbar"
          className={styles.List}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          data-gap={gap}
          data-size={size}
          data-has-overflow={overflowItems.length > 0 ? '' : undefined}
        >
          <div className={styles.OverflowContainer}>
            {/* An empty first element allows the real first item to wrap to the next line and get clipped. */}
            <div />
            <ActionBarItemsRegistry.Provider setRegistry={setChildRegistry}>{children}</ActionBarItemsRegistry.Provider>
          </div>
          <ActionMenu>
            <ActionMenu.Anchor>
              <IconButton
                variant="invisible"
                aria-label={`More ${ariaLabel} items`}
                icon={KebabHorizontalIcon}
                className={styles.MoreButton}
              />
            </ActionMenu.Anchor>
            <ActionMenu.Overlay>
              <ActionList>
                {overflowItems.map(([id, menuItem]) => {
                  if (menuItem.type === 'divider') {
                    return <ActionList.Divider key={id} />
                  }

                  if (menuItem.type === 'action') {
                    const {onClick, icon: Icon, label, disabled} = menuItem
                    return (
                      <ActionList.Item
                        key={label}
                        onSelect={event => {
                          typeof onClick === 'function' && onClick(event as React.MouseEvent<HTMLElement>)
                        }}
                        disabled={disabled}
                      >
                        <ActionList.LeadingVisual>
                          <Icon />
                        </ActionList.LeadingVisual>
                        {label}
                      </ActionList.Item>
                    )
                  }

                  if (menuItem.type === 'menu') {
                    const menuItems = menuItem.items
                    const {icon: Icon, label, returnFocusRef} = menuItem

                    return (
                      <ActionMenu key={id}>
                        <ActionMenu.Anchor>
                          <ActionList.Item>
                            {Icon !== 'none' ? (
                              <ActionList.LeadingVisual>
                                <Icon />
                              </ActionList.LeadingVisual>
                            ) : null}
                            {label}
                          </ActionList.Item>
                        </ActionMenu.Anchor>
                        <ActionMenu.Overlay {...(returnFocusRef && {returnFocusRef})}>
                          <ActionList>{menuItems.map((item, index) => renderMenuItem(item, index))}</ActionList>
                        </ActionMenu.Overlay>
                      </ActionMenu>
                    )
                  }
                })}
              </ActionList>
            </ActionMenu.Overlay>
          </ActionMenu>
        </div>
      </div>
    </ActionBarContext.Provider>
  )
}

function useActionBarItem(ref: React.RefObject<HTMLElement | null>, registryProps: ChildProps) {
  const isGroupOverflowing = useContext(ActionBarGroupContext)?.isOverflowing
  const isInGroup = isGroupOverflowing !== undefined

  const subscribeIntersectionObserver = useCallback(
    (onChange: () => void) => {
      // There's no need to register observers on items inside of a group
      // since the entire group overflows at once
      if (isInGroup) return () => {}

      const observer = new IntersectionObserver(() => onChange(), {threshold: 1})

      if (ref.current) observer.observe(ref.current)
      return () => observer.disconnect()
    },
    [ref, isInGroup],
  )

  const isItemOverflowing = useSyncExternalStore(
    subscribeIntersectionObserver,
    // Note: the IntersectionObserver is just being used as a trigger to re-check
    // `offsetTop > 0`; this is fast and simpler than checking visibility from
    // the observed entry. When an item wraps, it will move to the next row which
    // increases its `offsetTop`
    () => (ref.current ? ref.current.offsetTop > 0 : false),
    () => false,
  )

  const isOverflowing = isGroupOverflowing || isItemOverflowing

  ActionBarItemsRegistry.useRegisterDescendant(isOverflowing ? registryProps : null)

  return {isOverflowing, dataOverflowingAttr: isOverflowing ? '' : undefined}
}

export const ActionBarIconButton = forwardRef(
  ({disabled, onClick, ...props}: ActionBarIconButtonProps, forwardedRef) => {
    const ref = useRef<HTMLButtonElement>(null)
    useRefObjectAsForwardedRef(forwardedRef, ref)

    const {size} = React.useContext(ActionBarContext)

    const {['aria-label']: ariaLabel, icon} = props

    const {dataOverflowingAttr} = useActionBarItem(
      ref,
      useMemo(
        (): ChildProps => ({
          type: 'action',
          label: ariaLabel ?? '',
          icon,
          disabled: !!disabled,
          onClick: onClick as MouseEventHandler,
        }),
        [ariaLabel, icon, disabled, onClick],
      ),
    )

    const clickHandler = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        if (disabled) return
        onClick?.(event)
      },
      [disabled, onClick],
    )

    return (
      <IconButton
        aria-disabled={disabled}
        ref={ref}
        size={size}
        onClick={clickHandler}
        {...props}
        variant="invisible"
        data-overflowing={dataOverflowingAttr}
      />
    )
  },
)

const ActionBarGroupContext = React.createContext<{
  isOverflowing: boolean
} | null>(null)

export const ActionBarGroup = forwardRef(({children}: React.PropsWithChildren, forwardedRef) => {
  const backupRef = useRef<HTMLDivElement>(null)
  const ref = (forwardedRef ?? backupRef) as RefObject<HTMLDivElement>
  const {dataOverflowingAttr, isOverflowing} = useActionBarItem(
    ref,
    useMemo((): ChildProps => ({type: 'group'}), []),
  )

  return (
    <ActionBarGroupContext.Provider value={{isOverflowing}}>
      <div className={styles.Group} ref={ref} data-overflowing={dataOverflowingAttr}>
        {children}
      </div>
    </ActionBarGroupContext.Provider>
  )
})

export const ActionBarMenu = forwardRef(
  (
    {'aria-label': ariaLabel, icon, overflowIcon, items, returnFocusRef, ...props}: ActionBarMenuProps,
    forwardedRef,
  ) => {
    const backupRef = useRef<HTMLButtonElement>(null)
    const ref = (forwardedRef ?? backupRef) as RefObject<HTMLButtonElement>

    const [menuOpen, setMenuOpen] = useState(false)

    const {dataOverflowingAttr} = useActionBarItem(
      ref,
      useMemo(
        (): ChildProps => ({
          type: 'menu',
          label: ariaLabel,
          icon: overflowIcon ? overflowIcon : icon,
          returnFocusRef,
          items,
        }),
        [ariaLabel, overflowIcon, icon, items, returnFocusRef],
      ),
    )

    return (
      <ActionMenu anchorRef={ref} open={menuOpen} onOpenChange={setMenuOpen}>
        <ActionMenu.Anchor>
          <IconButton
            variant="invisible"
            aria-label={ariaLabel}
            icon={icon}
            {...props}
            data-overflowing={dataOverflowingAttr}
          />
        </ActionMenu.Anchor>
        <ActionMenu.Overlay {...(returnFocusRef && {returnFocusRef})}>
          <ActionList>{items.map((item, index) => renderMenuItem(item, index))}</ActionList>
        </ActionMenu.Overlay>
      </ActionMenu>
    )
  },
)

export const VerticalDivider = () => {
  const ref = useRef<HTMLDivElement>(null)
  const {dataOverflowingAttr} = useActionBarItem(
    ref,
    useMemo((): ChildProps => ({type: 'divider'}), []),
  )

  return (
    <div
      ref={ref}
      data-component="ActionBar.VerticalDivider"
      aria-hidden="true"
      className={styles.Divider}
      data-overflowing={dataOverflowingAttr}
    />
  )
}
