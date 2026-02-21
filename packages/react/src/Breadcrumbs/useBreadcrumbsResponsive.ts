import React, {useState, useRef, useCallback, useEffect, useMemo} from 'react'
import {useResizeObserver} from '../hooks/useResizeObserver'
import type {ResizeObserverEntry} from '../hooks/useResizeObserver'
import {BreadcrumbsOverflowMenu} from './BreadcrumbsOverflowMenu'

export type BreadcrumbsOverflowMode = 'wrap' | 'menu' | 'menu-with-root'

export interface UseBreadcrumbsResponsiveOptions {
  /**
   * The breadcrumb items to manage
   */
  children: React.ReactNode
  /**
   * Controls the overflow behavior of the breadcrumbs.
   * - 'wrap': All items wrap in the given space (no overflow menu)
   * - 'menu': Overflowing items appear in a dropdown menu
   * - 'menu-with-root': Like 'menu', but root item stays visible outside the menu
   * @default 'wrap'
   */
  overflow?: BreadcrumbsOverflowMode
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type BreadcrumbsItemElement = React.ReactElement<any>

export interface UseBreadcrumbsResponsiveReturn {
  /**
   * Items to display directly in the breadcrumb trail
   */
  visibleItems: BreadcrumbsItemElement[]
  /**
   * Items to display in the overflow menu
   */
  menuItems: BreadcrumbsItemElement[]
  /**
   * Whether to show the root item separately (outside menu).
   * Only relevant when overflow is 'menu-with-root'.
   */
  showRoot: boolean
  /**
   * The root item element (first child), if available
   */
  rootItem: BreadcrumbsItemElement | undefined
  /**
   * Ref to attach to the breadcrumbs container for resize observation
   */
  containerRef: React.RefObject<HTMLElement | null>
  /**
   * Pre-built overflow menu component for rendering hidden items
   */
  BreadcrumbsOverflowMenu: typeof BreadcrumbsOverflowMenu
}

/**
 * Filters React children to only valid elements
 */
export const getValidChildren = (children: React.ReactNode): BreadcrumbsItemElement[] => {
  return React.Children.toArray(children).filter(child => React.isValidElement(child)) as BreadcrumbsItemElement[]
}

const MENU_BUTTON_FALLBACK_WIDTH = 32 // Design system small IconButton

/**
 * Hook that manages responsive overflow behavior for Breadcrumbs.
 *
 * This hook handles the logic for determining which breadcrumb items should be
 * visible and which should be collapsed into an overflow menu based on
 * available container width.
 *
 * @example
 * ```tsx
 * const { visibleItems, menuItems, showRoot, rootItem, containerRef, BreadcrumbsOverflowMenu } =
 *   useBreadcrumbsResponsive({ children, overflow: 'menu' })
 *
 * return (
 *   <nav ref={containerRef}>
 *     {showRoot && rootItem}
 *     {menuItems.length > 0 && <BreadcrumbsOverflowMenu items={menuItems} />}
 *     {visibleItems.map(item => item)}
 *   </nav>
 * )
 * ```
 */
export function useBreadcrumbsResponsive(options: UseBreadcrumbsResponsiveOptions): UseBreadcrumbsResponsiveReturn {
  const {children, overflow = 'wrap'} = options

  const containerRef = useRef<HTMLElement | null>(null)
  const hideRoot = !(overflow === 'menu-with-root')
  const [effectiveHideRoot, setEffectiveHideRoot] = useState<boolean>(hideRoot)
  const childArray = useMemo(() => getValidChildren(children), [children])

  const rootItem = childArray[0]

  const [visibleItems, setVisibleItems] = useState<BreadcrumbsItemElement[]>(() => childArray)
  const [childArrayWidths, setChildArrayWidths] = useState<number[]>(() => [])
  const [menuItems, setMenuItems] = useState<BreadcrumbsItemElement[]>([])
  const [rootItemWidth, setRootItemWidth] = useState<number>(0)
  const [menuButtonWidth, setMenuButtonWidth] = useState(MENU_BUTTON_FALLBACK_WIDTH)

  // Measure child widths when children change
  useEffect(() => {
    const listElement = containerRef.current?.querySelector('ol')
    if (listElement && listElement.children.length > 0 && listElement.children.length === childArray.length) {
      const listElementArray = Array.from(listElement.children) as HTMLElement[]
      const widths = listElementArray.map(child => child.offsetWidth)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setChildArrayWidths(widths)

      setRootItemWidth(listElementArray[0].offsetWidth)
    }
  }, [childArray])

  const calculateOverflow = useCallback(
    (availableWidth: number) => {
      let eHideRoot = effectiveHideRoot
      const MENU_BUTTON_WIDTH = menuButtonWidth
      const MIN_VISIBLE_ITEMS = !eHideRoot ? 3 : 4

      const calculateVisibleItemsWidth = (w: number[]) => {
        const widths = w.reduce((sum, width) => sum + width + 16, 0)
        return !eHideRoot ? rootItemWidth + widths : widths
      }

      let currentVisibleItems = [...childArray]
      let currentVisibleItemWidths = [...childArrayWidths]
      let currentMenuItems: BreadcrumbsItemElement[] = []
      let currentMenuItemsWidths: number[] = []

      if (availableWidth > 0 && currentVisibleItemWidths.length > 0) {
        let visibleItemsWidthTotal = calculateVisibleItemsWidth(currentVisibleItemWidths)

        if (currentMenuItems.length > 0) {
          visibleItemsWidthTotal += MENU_BUTTON_WIDTH
        }
        while (
          (overflow === 'menu' || overflow === 'menu-with-root') &&
          (visibleItemsWidthTotal > availableWidth || currentVisibleItems.length > MIN_VISIBLE_ITEMS)
        ) {
          const itemToHide = currentVisibleItems[0]
          const itemToHideWidth = currentVisibleItemWidths[0]
          currentMenuItems = [...currentMenuItems, itemToHide]
          currentMenuItemsWidths = [...currentMenuItemsWidths, itemToHideWidth]
          currentVisibleItems = currentVisibleItems.slice(1)
          currentVisibleItemWidths = currentVisibleItemWidths.slice(1)

          visibleItemsWidthTotal = calculateVisibleItemsWidth(currentVisibleItemWidths)

          if (currentMenuItems.length > 0) {
            visibleItemsWidthTotal += MENU_BUTTON_WIDTH
          }

          if (currentVisibleItems.length === 1 && visibleItemsWidthTotal > availableWidth) {
            eHideRoot = true
            break
          } else {
            eHideRoot = hideRoot
          }
        }
      }
      return {
        visibleItems: currentVisibleItems,
        menuItems: currentMenuItems,
        effectiveHideRoot: eHideRoot,
      }
    },
    [childArray, childArrayWidths, effectiveHideRoot, hideRoot, overflow, rootItemWidth, menuButtonWidth],
  )

  const handleResize = useCallback(
    (entries: ResizeObserverEntry[]) => {
      if (entries[0]) {
        const containerWidth = entries[0].contentRect.width
        const result = calculateOverflow(containerWidth)
        if (
          (visibleItems.length !== result.visibleItems.length && menuItems.length !== result.menuItems.length) ||
          result.effectiveHideRoot !== effectiveHideRoot
        ) {
          setVisibleItems(result.visibleItems)
          setMenuItems(result.menuItems)
          setEffectiveHideRoot(result.effectiveHideRoot)
        }
      }
    },
    [calculateOverflow, effectiveHideRoot, menuItems.length, visibleItems.length],
  )

  useResizeObserver(handleResize, containerRef)

  // Initial overflow calculation for many items
  useEffect(() => {
    if ((overflow === 'menu' || overflow === 'menu-with-root') && childArray.length > 5 && menuItems.length === 0) {
      const containerWidth = containerRef.current?.offsetWidth || 800
      const result = calculateOverflow(containerWidth)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisibleItems(result.visibleItems)

      setMenuItems(result.menuItems)

      setEffectiveHideRoot(result.effectiveHideRoot)
    }
  }, [overflow, childArray, calculateOverflow, menuItems.length])

  // Compute effective menu items based on hideRoot setting
  const effectiveMenuItems = useMemo(() => {
    if (overflow === 'wrap' || menuItems.length === 0) {
      return []
    }
    // In 'menu-with-root' mode, exclude root from menu since it's shown separately
    if (!effectiveHideRoot) {
      return menuItems.slice(1)
    }
    return menuItems
  }, [overflow, menuItems, effectiveHideRoot])

  return {
    visibleItems,
    menuItems: effectiveMenuItems,
    showRoot: !effectiveHideRoot,
    rootItem,
    containerRef,
    BreadcrumbsOverflowMenu,
    // Internal setter for menu button width measurement (used by Breadcrumbs component)
    _setMenuButtonWidth: setMenuButtonWidth,
  } as UseBreadcrumbsResponsiveReturn & {_setMenuButtonWidth: React.Dispatch<React.SetStateAction<number>>}
}
