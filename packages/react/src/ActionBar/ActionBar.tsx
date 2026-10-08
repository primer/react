import {type RefObject, useContext} from 'react'
import React, {useState, useCallback, useRef, forwardRef, useMemo} from 'react'
import {KebabHorizontalIcon} from '@primer/octicons-react'
import {ActionList, type ActionListItemProps} from '../ActionList'

import type {ButtonProps, IconButtonProps} from '../Button'
import {Button, IconButton} from '../Button'
import {ActionMenu} from '../ActionMenu'
import {useFocusZone, FocusKeys} from '../hooks/useFocusZone'
import styles from './ActionBar.module.css'
import {clsx} from 'clsx'
import {useMergedRefs} from '../hooks'
import {createDescendantRegistry} from '../utils/descendant-registry'
import {OverflowObserverProvider} from '../internal/components/OverflowObserverProvider'
import {useIsClipped} from '../internal/hooks/useOverflowObserver'

type ChildProps =
  | {
      type: 'action'
      label: React.ReactNode
      disabled: boolean
      icon?: ActionBarIconButtonProps['icon']
      onActivate: () => void
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
  overflowButtonRef: React.RefObject<HTMLButtonElement | null>
}>({
  size: 'medium',
  overflowButtonRef: {current: null},
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

type ActiveAnchorProps = {
  disabled?: boolean
  /**
   * Receives the visible trigger representing this action. Points to this button while inline and the ActionBar
   * overflow button while this action is overflowing.
   */
  activeAnchorRef?: React.Ref<HTMLButtonElement>
}

export type ActionBarIconButtonProps = ActiveAnchorProps & IconButtonProps

export type ActionBarButtonProps = ActiveAnchorProps & ButtonProps

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

const FOCUSABLE_ITEM_SELECTOR =
  ':is(button, a, input, [tabindex]):not(:disabled):not([data-overflowing]):not([data-more-button-inactive])'

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

export const ActionBar: React.FC<React.PropsWithChildren<ActionBarProps>> = ({
  size = 'medium',
  children,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  flush = false,
  className,
  gap = 'condensed',
}) => {
  const [childRegistry, setChildRegistry] = ActionBarItemsRegistry.useRegistryState()
  const [overflowMenuOpen, setOverflowMenuOpen] = useState(false)
  const overflowButtonRef = useRef<HTMLButtonElement>(null)

  const overflowItems = useMemo(
    () =>
      childRegistry &&
      Array.from(childRegistry.entries()).filter((entry): entry is [string, ChildProps] => entry[1] !== null),
    [childRegistry],
  )

  const {containerRef} = useFocusZone(
    {
      bindKeys: FocusKeys.ArrowHorizontal | FocusKeys.HomeAndEnd,
      focusOutBehavior: 'wrap',
      focusableElementFilter: element => element.matches(FOCUSABLE_ITEM_SELECTOR),
    },
    [overflowItems],
  )

  return (
    <ActionBarContext.Provider value={{size, overflowButtonRef}}>
      <div className={clsx(className, styles.Nav)} data-component="ActionBar" data-flush={flush}>
        <div
          ref={containerRef as RefObject<HTMLDivElement>}
          role="toolbar"
          className={styles.List}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          data-gap={gap}
          data-size={size}
          data-has-overflow={overflowItems ? overflowItems.length > 0 : undefined}
        >
          <div className={styles.OverflowContainer}>
            {/* An empty first element allows the real first item to wrap to the next line and get clipped. */}
            <div className={styles.OverflowSpacer} />
            <OverflowObserverProvider rootRef={containerRef}>
              <ActionBarItemsRegistry.Provider setRegistry={setChildRegistry}>
                {children}
              </ActionBarItemsRegistry.Provider>
            </OverflowObserverProvider>
          </div>
          <ActionMenu anchorRef={overflowButtonRef} open={overflowMenuOpen} onOpenChange={setOverflowMenuOpen}>
            <ActionMenu.Anchor>
              <IconButton
                variant="invisible"
                aria-label="More items"
                icon={KebabHorizontalIcon}
                className={styles.MoreButton}
                data-more-button-inactive={overflowItems?.length ? undefined : true}
                size={size}
              />
            </ActionMenu.Anchor>
            <ActionMenu.Overlay>
              <ActionList>
                {overflowItems?.map(([id, menuItem]) => {
                  if (menuItem.type === 'divider') {
                    return <ActionList.Divider key={id} />
                  }

                  if (menuItem.type === 'action') {
                    const {onActivate, icon: Icon, label, disabled} = menuItem
                    return (
                      <ActionList.Item
                        key={id}
                        onSelect={event => {
                          event.preventDefault()
                          setOverflowMenuOpen(false)
                          onActivate()
                        }}
                        disabled={disabled}
                      >
                        {Icon ? (
                          <ActionList.LeadingVisual>
                            <Icon />
                          </ActionList.LeadingVisual>
                        ) : null}
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

function useActionBarItem(
  ref: React.RefObject<HTMLElement | null>,
  registryProps: ChildProps,
  activeAnchorRef?: React.Ref<HTMLButtonElement>,
) {
  const isGroupOverflowing = useContext(ActionBarGroupContext)?.isOverflowing
  const {overflowButtonRef} = useContext(ActionBarContext)
  const isInGroup = isGroupOverflowing !== undefined

  // There's no need to observe items inside of a group since the entire group overflows at once, so `disabled` skips
  // subscription for grouped items and always reports `false` for the child item itself.
  const isItemOverflowing = useIsClipped(ref, {disabled: isInGroup})

  const isOverflowing = isGroupOverflowing || isItemOverflowing
  const setActiveAnchorRef = useMergedRefs(activeAnchorRef, undefined)
  const publishActiveAnchor = useCallback(
    (button: HTMLButtonElement | null) => {
      if (!activeAnchorRef || button === null) return setActiveAnchorRef(null)
      return setActiveAnchorRef(isOverflowing ? overflowButtonRef.current : button)
    },
    [activeAnchorRef, isOverflowing, overflowButtonRef, setActiveAnchorRef],
  )

  ActionBarItemsRegistry.useRegisterDescendant(isOverflowing ? registryProps : null)

  return {isOverflowing, dataOverflowingAttr: isOverflowing ? '' : undefined, publishActiveAnchor}
}

export const ActionBarIconButton = forwardRef(
  ({disabled, onClick, activeAnchorRef, ...props}: ActionBarIconButtonProps, forwardedRef) => {
    const ref = useRef<HTMLButtonElement>(null)
    const forwardedAndInternalRef = useMergedRefs(forwardedRef, ref)

    const {size} = React.useContext(ActionBarContext)

    const ariaLabel = props['aria-label']
    const {icon} = props

    const activate = useCallback(() => ref.current?.click(), [])

    const {dataOverflowingAttr, publishActiveAnchor} = useActionBarItem(
      ref,
      useMemo(
        (): ChildProps => ({
          type: 'action',
          label: ariaLabel ?? '',
          icon,
          disabled: !!disabled,
          onActivate: activate,
        }),
        [ariaLabel, icon, disabled, activate],
      ),
      activeAnchorRef,
    )
    const mergedRef = useMergedRefs(forwardedAndInternalRef, publishActiveAnchor)

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
        ref={mergedRef}
        size={size}
        onClick={clickHandler}
        {...props}
        variant="invisible"
        data-overflowing={dataOverflowingAttr}
      />
    )
  },
)

export const ActionBarButton = forwardRef(
  ({disabled, onClick, activeAnchorRef, ...props}: ActionBarButtonProps, forwardedRef) => {
    const ref = useRef<HTMLButtonElement>(null)
    const forwardedAndInternalRef = useMergedRefs(forwardedRef, ref)

    const {size} = React.useContext(ActionBarContext)

    const {children, leadingVisual} = props

    const activate = useCallback(() => ref.current?.click(), [])

    const {dataOverflowingAttr, publishActiveAnchor} = useActionBarItem(
      ref,
      useMemo(
        (): ChildProps => ({
          type: 'action',
          label: children,
          // Only forward the leading visual to the overflow menu when it is a component
          // that can be rendered as an icon (e.g. an octicon), matching ActionBar.IconButton.
          icon: typeof leadingVisual === 'function' ? (leadingVisual as ActionBarIconButtonProps['icon']) : undefined,
          disabled: !!disabled,
          onActivate: activate,
        }),
        [children, leadingVisual, disabled, activate],
      ),
      activeAnchorRef,
    )
    const mergedRef = useMergedRefs(forwardedAndInternalRef, publishActiveAnchor)

    const clickHandler = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        if (disabled) return
        onClick?.(event)
      },
      [disabled, onClick],
    )

    return (
      <Button
        aria-disabled={disabled}
        ref={mergedRef}
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
      <div className={styles.Group} data-component="ActionBar.Group" ref={ref} data-overflowing={dataOverflowingAttr}>
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
            // overriding IconButton's data-component so that the ActionBar's "More Menu" Icon can be targeted specifically
            data-component="ActionBar.Menu.IconButton"
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
