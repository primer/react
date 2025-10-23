import type {RefObject, MouseEventHandler} from 'react'
import React, {useState, useCallback, useRef, forwardRef, useId} from 'react'
import {KebabHorizontalIcon} from '@primer/octicons-react'
import {ActionList} from '../ActionList'
import useIsomorphicLayoutEffect from '../utils/useIsomorphicLayoutEffect'
import {useOnEscapePress} from '../hooks/useOnEscapePress'
import type {ResizeObserverEntry} from '../hooks/useResizeObserver'
import {useResizeObserver} from '../hooks/useResizeObserver'

import {useOnOutsideClick} from '../hooks/useOnOutsideClick'
import type {IconButtonProps} from '../Button'
import {IconButton} from '../Button'
import {ActionMenu} from '../ActionMenu'
import {useFocusZone, FocusKeys} from '../hooks/useFocusZone'
import styles from './ActionBar.module.css'
import {clsx} from 'clsx'
import {useRefObjectAsForwardedRef} from '../hooks'

const ACTIONBAR_ITEM_GAP = 8

type ChildProps =
  | {
      type: 'action'
      label: string
      disabled: boolean
      icon: ActionBarIconButtonProps['icon']
      onClick: MouseEventHandler
      width: number
      groupId?: string
    }
  | {type: 'divider'; width: number}
  | {type: 'group'; width: number}

/**
 * Registry of descendants to render in the list or menu. To preserve insertion order across updates, children are
 * set to `null` when unregistered rather than fully dropped from the map.
 */
type ChildRegistry = ReadonlyMap<string, ChildProps | null>

const ActionBarContext = React.createContext<{
  size: Size
  registerChild: (id: string, props: ChildProps) => void
  unregisterChild: (id: string, groupId?: string) => void
  isVisibleChild: (id: string) => boolean
  groupId?: string
}>({
  size: 'medium',
  registerChild: () => {},
  unregisterChild: () => {},
  isVisibleChild: () => true,
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
} & A11yProps

export type ActionBarIconButtonProps = {disabled?: boolean} & IconButtonProps

const MORE_BTN_WIDTH = 32

const calculatePossibleItems = (registryEntries: Array<[string, ChildProps]>, navWidth: number, moreMenuWidth = 0) => {
  const widthToFit = navWidth - moreMenuWidth
  let breakpoint = registryEntries.length // assume all items will fit
  let sumsOfChildWidth = 0
  for (const [index, [, child]] of registryEntries.entries()) {
    sumsOfChildWidth += index > 0 ? child.width + ACTIONBAR_ITEM_GAP : child.width
    if (sumsOfChildWidth > widthToFit) {
      breakpoint = index
      break
    } else {
      continue
    }
  }
  return breakpoint
}

const getMenuItems = (
  navWidth: number,
  moreMenuWidth: number,
  childRegistry: ChildRegistry,
  hasActiveMenu: boolean,
): Set<string> | void => {
  const registryEntries = Array.from(childRegistry).filter(
    (entry): entry is [string, ChildProps] =>
      entry[1] !== null && (entry[1].type !== 'action' || entry[1].groupId === undefined),
  )

  if (registryEntries.length === 0) return new Set()
  const numberOfItemsPossible = calculatePossibleItems(registryEntries, navWidth)

  const numberOfItemsPossibleWithMoreMenu = calculatePossibleItems(
    registryEntries,
    navWidth,
    moreMenuWidth || MORE_BTN_WIDTH,
  )
  const menuItems = new Set<string>()

  // First, we check if we can fit all the items with their icons
  if (registryEntries.length >= numberOfItemsPossible) {
    /* Below is an accessibility requirement. Never show only one item in the overflow menu.
     * If there is only one item left to display in the overflow menu according to the calculation,
     * we need to pull another item from the list into the overflow menu.
     */
    const numberOfItemsInMenu = registryEntries.length - numberOfItemsPossibleWithMoreMenu
    const numberOfListItems =
      numberOfItemsInMenu === 1 ? numberOfItemsPossibleWithMoreMenu - 1 : numberOfItemsPossibleWithMoreMenu
    for (const [index, [id, child]] of registryEntries.entries()) {
      if (index < numberOfListItems) {
        continue
        //if the last item is a divider
      } else if (child.type === 'divider') {
        if (index === numberOfListItems - 1 || index === numberOfListItems) {
          continue
        } else {
          menuItems.add(id)
        }
      } else {
        menuItems.add(id)
      }
    }

    return menuItems
  } else if (numberOfItemsPossible > registryEntries.length && hasActiveMenu) {
    /* If the items fit in the list and there are items in the overflow menu, we need to move them back to the list */
    return new Set()
  }
}

export const ActionBar: React.FC<React.PropsWithChildren<ActionBarProps>> = props => {
  const {
    size = 'medium',
    children,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    flush = false,
    className,
  } = props

  const [childRegistry, setChildRegistry] = useState<ChildRegistry>(() => new Map())

  const registerChild = useCallback(
    (id: string, childProps: ChildProps) => setChildRegistry(prev => new Map(prev).set(id, childProps)),
    [],
  )
  const unregisterChild = useCallback((id: string) => setChildRegistry(prev => new Map(prev).set(id, null)), [])

  const [menuItemIds, setMenuItemIds] = useState<Set<string>>(() => new Set())

  const navRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const moreMenuRef = useRef<HTMLLIElement>(null)
  const moreMenuBtnRef = useRef<HTMLButtonElement>(null)
  const containerRef = React.useRef<HTMLUListElement>(null)

  useResizeObserver((resizeObserverEntries: ResizeObserverEntry[]) => {
    const navWidth = resizeObserverEntries[0].contentRect.width
    const moreMenuWidth = moreMenuRef.current?.getBoundingClientRect().width ?? 0
    const hasActiveMenu = menuItemIds.size > 0

    if (navWidth > 0) {
      const newMenuItemIds = getMenuItems(navWidth, moreMenuWidth, childRegistry, hasActiveMenu)
      if (newMenuItemIds) setMenuItemIds(newMenuItemIds)
    }
  }, navRef as RefObject<HTMLElement>)

  const isVisibleChild = useCallback(
    (id: string) => {
      return !menuItemIds.has(id)
    },
    [menuItemIds],
  )

  const [isWidgetOpen, setIsWidgetOpen] = useState(false)

  const closeOverlay = React.useCallback(() => {
    setIsWidgetOpen(false)
  }, [setIsWidgetOpen])

  const focusOnMoreMenuBtn = React.useCallback(() => {
    moreMenuBtnRef.current?.focus()
  }, [])

  useOnEscapePress(
    (event: KeyboardEvent) => {
      if (isWidgetOpen) {
        event.preventDefault()
        closeOverlay()
        focusOnMoreMenuBtn()
      }
    },
    [isWidgetOpen],
  )

  useOnOutsideClick({onClickOutside: closeOverlay, containerRef, ignoreClickRefs: [moreMenuBtnRef]})

  useFocusZone({
    containerRef: listRef,
    bindKeys: FocusKeys.ArrowHorizontal | FocusKeys.HomeAndEnd,
    focusOutBehavior: 'wrap',
  })

  const groupedItems = React.useMemo(() => {
    const groupedItemsMap = new Map<string, Array<[string, ChildProps]>>()

    for (const [key, childProps] of childRegistry) {
      if (childProps?.type === 'action' && childProps.groupId) {
        const existingGroup = groupedItemsMap.get(childProps.groupId) || []
        existingGroup.push([key, childProps])
        groupedItemsMap.set(childProps.groupId, existingGroup)
      }
    }
    return groupedItemsMap
  }, [childRegistry])

  return (
    <ActionBarContext.Provider value={{size, registerChild, unregisterChild, isVisibleChild}}>
      <div ref={navRef} className={clsx(className, styles.Nav)} data-flush={flush}>
        <div
          ref={listRef}
          role="toolbar"
          className={styles.List}
          style={{gap: `${ACTIONBAR_ITEM_GAP}px`}}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
        >
          {children}
          {menuItemIds.size > 0 && (
            <ActionMenu>
              <ActionMenu.Anchor>
                <IconButton variant="invisible" aria-label={`More ${ariaLabel} items`} icon={KebabHorizontalIcon} />
              </ActionMenu.Anchor>
              <ActionMenu.Overlay>
                <ActionList>
                  {Array.from(menuItemIds).map(id => {
                    const menuItem = childRegistry.get(id)
                    if (!menuItem) return null

                    if (menuItem.type === 'divider') {
                      return <ActionList.Divider key={id} />
                    } else if (menuItem.type === 'action') {
                      const {onClick, icon: Icon, label, disabled} = menuItem
                      return (
                        <ActionList.Item
                          key={label}
                          // eslint-disable-next-line primer-react/prefer-action-list-item-onselect
                          onClick={(event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
                            closeOverlay()
                            focusOnMoreMenuBtn()
                            typeof onClick === 'function' && onClick(event)
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

                    // Use the memoized map instead of filtering each time
                    const groupedMenuItems = groupedItems.get(id) || []

                    // If we ever add additional types, this condition will be necessary
                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                    if (menuItem.type === 'group') {
                      return (
                        <React.Fragment key={id}>
                          {groupedMenuItems.map(([key, childProps]) => {
                            if (childProps.type === 'action') {
                              const {onClick, icon: Icon, label, disabled} = childProps
                              return (
                                <ActionList.Item
                                  key={key}
                                  onSelect={event => {
                                    closeOverlay()
                                    focusOnMoreMenuBtn()
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
                            return null
                          })}
                        </React.Fragment>
                      )
                    }
                  })}
                </ActionList>
              </ActionMenu.Overlay>
            </ActionMenu>
          )}
        </div>
      </div>
    </ActionBarContext.Provider>
  )
}

export const ActionBarIconButton = forwardRef(
  ({disabled, onClick, ...props}: ActionBarIconButtonProps, forwardedRef) => {
    const ref = useRef<HTMLButtonElement>(null)
    useRefObjectAsForwardedRef(forwardedRef, ref)
    const id = useId()

    const {size, registerChild, unregisterChild, isVisibleChild} = React.useContext(ActionBarContext)
    const {groupId} = React.useContext(ActionBarGroupContext)

    // Storing the width in a ref ensures we don't forget about it when not visible
    const widthRef = useRef<number>()

    useIsomorphicLayoutEffect(() => {
      const width = ref.current?.getBoundingClientRect().width
      if (width) widthRef.current = width
      if (!widthRef.current) return

      registerChild(id, {
        type: 'action',
        label: props['aria-label'] ?? '',
        icon: props.icon,
        disabled: !!disabled,
        onClick: onClick as MouseEventHandler,
        width: widthRef.current,
        groupId: groupId ?? undefined,
      })

      return () => {
        unregisterChild(id)
      }
    }, [registerChild, unregisterChild, props['aria-label'], props.icon, disabled, onClick])

    const clickHandler = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        if (disabled) return
        onClick?.(event)
      },
      [disabled, onClick],
    )

    if (!isVisibleChild(id) || (groupId && !isVisibleChild(groupId))) return null

    return (
      <IconButton
        aria-disabled={disabled}
        ref={ref}
        size={size}
        onClick={clickHandler}
        {...props}
        variant="invisible"
        data-testid={id}
      />
    )
  },
)

const ActionBarGroupContext = React.createContext<{
  groupId: string | null
}>({groupId: null})

export const ActionBarGroup = forwardRef(({children}: React.PropsWithChildren, forwardedRef) => {
  const backupRef = useRef<HTMLDivElement>(null)
  const ref = (forwardedRef ?? backupRef) as RefObject<HTMLDivElement>
  const id = useId()
  const {registerChild, unregisterChild} = React.useContext(ActionBarContext)

  // Like IconButton, we store the width in a ref ensures we don't forget about it when not visible
  // If a child has a groupId, it won't be visible if the group isn't visible, so we don't need to check isVisibleChild here
  const widthRef = useRef<number>()

  useIsomorphicLayoutEffect(() => {
    const width = ref.current?.getBoundingClientRect().width
    if (width) widthRef.current = width
    if (!widthRef.current) return

    registerChild(id, {type: 'group', width: widthRef.current})

    return () => {
      unregisterChild(id)
    }
  }, [registerChild, unregisterChild])

  return (
    <ActionBarGroupContext.Provider value={{groupId: id}}>
      <div className={styles.Group} ref={ref}>
        {children}
      </div>
    </ActionBarGroupContext.Provider>
  )
})

export const VerticalDivider = () => {
  const ref = useRef<HTMLDivElement>(null)
  const id = useId()
  const {registerChild, unregisterChild, isVisibleChild} = React.useContext(ActionBarContext)

  // Storing the width in a ref ensures we don't forget about it when not visible
  const widthRef = useRef<number>()

  useIsomorphicLayoutEffect(() => {
    const width = ref.current?.getBoundingClientRect().width
    if (width) widthRef.current = width
    if (!widthRef.current) return

    registerChild(id, {type: 'divider', width: widthRef.current})

    return () => unregisterChild(id)
  }, [registerChild, unregisterChild])

  if (!isVisibleChild(id)) return null
  return <div ref={ref} data-component="ActionBar.VerticalDivider" aria-hidden="true" className={styles.Divider} />
}
