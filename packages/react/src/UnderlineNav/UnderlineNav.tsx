import type {RefObject} from 'react'
import React, {useRef, forwardRef, useCallback, useState} from 'react'
import {useDevOnlyEffect} from '../internal/hooks/useDevOnlyEffect'
import {UnderlineNavContext} from './UnderlineNavContext'
import type {ResizeObserverEntry} from '../hooks/useResizeObserver'
import {useResizeObserver} from '../hooks/useResizeObserver'
import useIsomorphicLayoutEffect from '../utils/useIsomorphicLayoutEffect'
import type {ChildWidthMap, ResponsiveProps} from './types'
import VisuallyHidden from '../_VisuallyHidden'
import {dividerStyles, menuItemStyles, baseMenuMinWidth} from './styles'
import {UnderlineItemList, UnderlineWrapper, LoadingCounter, GAP} from '../internal/components/UnderlineTabbedInterface'
import {Button} from '../Button'
import {TriangleDownIcon} from '@primer/octicons-react'
import {useOnEscapePress} from '../hooks/useOnEscapePress'
import {useOnOutsideClick} from '../hooks/useOnOutsideClick'
import {useId} from '../hooks/useId'
import {ActionList} from '../ActionList'
import CounterLabel from '../CounterLabel'
import {invariant} from '../utils/invariant'
import classes from './UnderlineNav.module.css'
import {getAnchoredPosition} from '@primer/behaviors'

export type UnderlineNavProps = {
  children: React.ReactNode
  'aria-label'?: React.AriaAttributes['aria-label']
  as?: React.ElementType
  className?: string
  /**
   * loading state for all counters. It displays loading animation for individual counters (UnderlineNav.Item) until all are resolved. It is needed to prevent multiple layout shift.
   */
  loadingCounters?: boolean
  /**
   * There are cases where you may not want the horizontal padding on items,
   * and panels to make the tabs look horizontally aligned with the content above and below it.
   * Setting this to `flush` will remove the horizontal padding on the items.
   */
  variant?: 'inset' | 'flush'
}
// When page is loaded, we don't have ref for the more button as it is not on the DOM yet.
// However, we need to calculate number of possible items when the more button present as well. So using the width of the more button as a constant.
const MORE_BTN_WIDTH = 86
// The height is needed to make sure we don't have a layout shift when the more button is the only item in the nav.
const MORE_BTN_HEIGHT = 45

const computeOverflow = (
  navWidth: number,
  moreMenuWidth: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  childArray: Array<React.ReactElement<any>>,
  childWidths: ChildWidthMap,
  noIconChildWidths: ChildWidthMap,
): {items: ResponsiveProps['items']; menuItems: ResponsiveProps['menuItems']; iconsVisible: boolean} => {
  let iconsVisible = true
  if (childWidths.size === 0) {
    return {items: childArray, menuItems: [], iconsVisible}
  }
  const numberOfItemsPossible = calculatePossibleItems(childArray, childWidths, navWidth)
  const numberOfItemsWithoutIconPossible = calculatePossibleItems(childArray, noIconChildWidths, navWidth)
  // We need to take more menu width into account when calculating the number of items possible
  const numberOfItemsPossibleWithMoreMenu = calculatePossibleItems(
    childArray,
    noIconChildWidths,
    navWidth,
    moreMenuWidth || MORE_BTN_WIDTH,
  )
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const items: Array<React.ReactElement<any>> = []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const menuItems: Array<React.ReactElement<any>> = []

  // First, we check if we can fit all the items with their icons
  if (childArray.length <= numberOfItemsPossible) {
    items.push(...childArray)
  } else if (childArray.length <= numberOfItemsWithoutIconPossible) {
    // if we can't fit all the items with their icons, we check if we can fit all the items without their icons
    iconsVisible = false
    items.push(...childArray)
  } else {
    // if we can't fit all the items without their icons, we keep the icons hidden and show the ones that doesn't fit into the list in the overflow menu
    iconsVisible = false

    /* Below is an accessibility requirement. Never show only one item in the overflow menu.
     * If there is only one item left to display in the overflow menu according to the calculation,
     * we need to pull another item from the list into the overflow menu.
     */
    const numberOfItemsInMenu = childArray.length - numberOfItemsPossibleWithMoreMenu
    const numberOfListItems =
      numberOfItemsInMenu === 1 ? numberOfItemsPossibleWithMoreMenu - 1 : numberOfItemsPossibleWithMoreMenu
    for (const [index, child] of childArray.entries()) {
      if (index < numberOfListItems) {
        items.push(child)
      } else {
        const ariaCurrent = child.props['aria-current']
        const isCurrent = Boolean(ariaCurrent) && ariaCurrent !== 'false'
        // We need to make sure to keep the selected item always visible.
        // To do that, we swap the selected item with the last item in the list to make it visible. (When there is at least 1 item in the list to swap.)
        if (isCurrent && numberOfListItems > 0) {
          // If selected item couldn't make in to the list, we swap it with the last item in the list.
          const indexToReplaceAt = numberOfListItems - 1 // because we are replacing the last item in the list
          // splice method modifies the array by removing 1 item here at the given index and replace it with the "child" element then returns the removed item.
          const propsectiveAction = items.splice(indexToReplaceAt, 1, child)[0]
          menuItems.push(propsectiveAction)
        } else {
          menuItems.push(child)
        }
      }
    }
  }
  return {items, menuItems, iconsVisible}
}

const getValidChildren = (children: React.ReactNode) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return React.Children.toArray(children).filter(child => React.isValidElement(child)) as React.ReactElement<any>[]
}

const calculatePossibleItems = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  childArray: Array<React.ReactElement<any>>,
  widthMap: ChildWidthMap,
  navWidth: number,
  moreMenuWidth = 0,
) => {
  const widthToFit = navWidth - moreMenuWidth
  let breakpoint = childArray.length // assume all items will fit
  let sumsOfChildWidth = 0
  for (const [index, child] of childArray.entries()) {
    const width = widthMap.get(String(child.key)) ?? 0
    sumsOfChildWidth = sumsOfChildWidth + width + GAP
    if (sumsOfChildWidth > widthToFit) {
      breakpoint = index
      break
    }
  }
  return breakpoint
}

// Inline styles converted from baseMenuStyles for use as CSSProperties
const baseMenuInlineStyles: React.CSSProperties = {
  position: 'absolute',
  zIndex: 1,
  top: '90%',
  boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
  borderRadius: 12,
  background: 'var(--overlay-bgColor)',
  listStyle: 'none',
  minWidth: `${baseMenuMinWidth}px`,
  maxWidth: '640px',
  right: 0,
}

export const UnderlineNav = forwardRef(
  (
    {
      as = 'nav',
      'aria-label': ariaLabel,
      loadingCounters = false,
      variant = 'inset',
      className,
      children,
    }: UnderlineNavProps,
    forwardedRef,
  ) => {
    const backupRef = useRef<HTMLElement>(null)
    const navRef = (forwardedRef ?? backupRef) as RefObject<HTMLElement>
    const listRef = useRef<HTMLUListElement>(null)
    const moreMenuRef = useRef<HTMLLIElement>(null)
    const moreMenuBtnRef = useRef<HTMLButtonElement>(null)
    const containerRef = React.useRef<HTMLUListElement>(null)
    const disclosureWidgetId = useId()

    const [isWidgetOpen, setIsWidgetOpen] = useState(false)
    // Measurement results are stored in refs because only `computeOverflow` reads them;
    // they should not trigger re-renders. Keyed by `String(element.key)` so lookups
    // are O(1) and survive non-string item children.
    const childWidthsRef = useRef<ChildWidthMap>(new Map())
    const noIconChildWidthsRef = useRef<ChildWidthMap>(new Map())

    const validChildren = getValidChildren(children)
    // Stable signature of the children list — when it changes we re-run the
    // measurement pass with all items rendered (with icons) in the list. The
    // delimiter is U+0000 (NUL) because React rejects NUL inside element keys,
    // so consumer-provided keys cannot collide with the separator.
    const childrenKey = validChildren.map(c => String(c.key)).join('\u0000')

    // Single consolidated overflow state. Bundling `items`, `menuItems`,
    // `iconsVisible`, `measured`, and `childrenKey` together means every
    // overflow update — measurement, swap, resize, or children-change reset —
    // is exactly one setState call (one commit), instead of fanning out to
    // multiple back-to-back commits.
    type OverflowState = {
      items: ResponsiveProps['items']
      menuItems: ResponsiveProps['menuItems']
      iconsVisible: boolean
      measured: boolean
      childrenKey: string
    }
    const [overflowState, setOverflowState] = useState<OverflowState>(() => ({
      items: validChildren,
      menuItems: [],
      iconsVisible: true,
      measured: false,
      childrenKey,
    }))

    // Derived-state reset: when the children list changes, push everything back into
    // the list (with icons) so the next layout effect can measure all items in one
    // pass. This is React's recommended "store information from previous renders"
    // pattern — calling setState during render lets React discard the in-progress
    // render and re-render immediately with the reset state, before paint.
    if (overflowState.childrenKey !== childrenKey) {
      setOverflowState({items: validChildren, menuItems: [], iconsVisible: true, measured: false, childrenKey})
    }

    // Build a key-indexed view of validChildren once per render so the listItems /
    // menuItems prop-refresh below is O(N) instead of O(N^2) via Array.prototype.find.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const validChildrenByKey = new Map<string, React.ReactElement<any>>()
    for (const c of validChildren) validChildrenByKey.set(String(c.key), c)

    const {iconsVisible, measured: isOverflowMeasured} = overflowState

    // Make sure to have the fresh props data for list items when children are changed (keeping aria-current up-to-date)
    const listItems = overflowState.items.map(item => validChildrenByKey.get(String(item.key)) ?? item)

    // Make sure to have the fresh props data for menu items when children are changed (keeping aria-current up-to-date)
    const menuItems = overflowState.menuItems.map(item => validChildrenByKey.get(String(item.key)) ?? item)
    // This is the case where the viewport is too narrow to show any list item with the more menu. In this case, we only show the dropdown
    const onlyMenuVisible = overflowState.items.length === 0

    useDevOnlyEffect(() => {
      // Address illegal state where there are multiple items that have `aria-current='page'` attribute
      const activeElements = validChildren.filter(child => {
        return child.props['aria-current'] !== undefined
      })
      invariant(activeElements.length <= 1, 'Only one current element is allowed')
      invariant(ariaLabel, 'Use the `aria-label` prop to provide an accessible label for assistive technology')
    }, [validChildren, ariaLabel])

    // Returns the measured "no icon" width for an item, looking up by element key.
    // Previously this was a text-based lookup, which silently returned 0 when an
    // item's children weren't a plain string and caused the swap math to degenerate.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getItemNoIconWidth = (item: React.ReactElement<any>): number =>
      noIconChildWidthsRef.current.get(String(item.key)) ?? 0

    // Pure: returns the {items, menuItems} that result from promoting
    // `prospectiveListItem` (currently at position `indexOfProspectiveListItem`
    // in `currentMenuItems`) into `currentItems`. Does not call setState.
    const computeSwap = (
      currentItems: ResponsiveProps['items'],
      currentMenuItems: ResponsiveProps['menuItems'],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      prospectiveListItem: React.ReactElement<any>,
      indexOfProspectiveListItem: number,
    ): {items: ResponsiveProps['items']; menuItems: ResponsiveProps['menuItems']} => {
      const widthToFitIntoList = getItemNoIconWidth(prospectiveListItem)
      const availableSpace =
        (navRef.current?.getBoundingClientRect().width ?? 0) - (listRef.current?.getBoundingClientRect().width ?? 0)

      // How many items at the end of the list have to move to the menu to make
      // room for the promoted item.
      let widthToSwap = 0
      let breakpoint = 0
      for (const [index, item] of [...currentItems].reverse().entries()) {
        widthToSwap += getItemNoIconWidth(item)
        if (widthToFitIntoList < widthToSwap + availableSpace) {
          breakpoint = index
          break
        }
      }

      const indexToSliceAt = currentItems.length - 1 - breakpoint
      const itemsLeftInList = currentItems.slice(0, indexToSliceAt)
      const updatedItemList = [...itemsLeftInList, prospectiveListItem]
      const itemsToAddToMenu = currentItems.slice(indexToSliceAt)
      const updatedMenuItems = [...currentMenuItems]
      updatedMenuItems.splice(indexOfProspectiveListItem, 1, ...itemsToAddToMenu)
      return {items: updatedItemList, menuItems: updatedMenuItems}
    }

    const swapMenuItemWithListItem = (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      prospectiveListItem: React.ReactElement<any>,
      indexOfProspectiveListItem: number,
    ) => {
      const swap = computeSwap(overflowState.items, menuItems, prospectiveListItem, indexOfProspectiveListItem)
      setOverflowState(prev => ({
        items: swap.items,
        menuItems: swap.menuItems,
        iconsVisible: false,
        measured: true,
        childrenKey: prev.childrenKey,
      }))
    }

    // Single combined layout effect that performs measurement (when needed) and
    // the external-aria-current promotion (when needed), then commits at most
    // one setOverflowState per pass. Replaces the previous two effects (each of
    // which produced its own commit) and removes the render-phase setState that
    // the original component used to do the same swap from inside menuItems.map.
    //
    // Why no deps array: the swap branch depends on `aria-current` which lives
    // on item props (not on `overflowState`); a deps-driven effect would not
    // notice prop-only changes without rebuilding a signature. The body
    // short-circuits cheaply on every render where neither pass needs to run.
    useIsomorphicLayoutEffect(() => {
      const listEl = listRef.current
      const navEl = navRef.current
      if (!listEl || !navEl) return

      let next: OverflowState | null = null

      // Pass 1: measurement (runs once after each remeasure trigger).
      if (!isOverflowMeasured) {
        const widths: ChildWidthMap = new Map()
        const noIconWidths: ChildWidthMap = new Map()
        const itemEls = listEl.querySelectorAll<HTMLElement>('[data-underlinenav-item="true"]')

        // The N-th [data-underlinenav-item] element corresponds to validChildren[N]
        // because the measurement pass runs only when all items are in the list,
        // in render order. Pair them up positionally so we can key widths by the
        // element's React key.
        const upToBoundary = Math.min(itemEls.length, validChildren.length)
        for (let index = 0; index < upToBoundary; index++) {
          const liEl = itemEls[index]
          const linkEl = liEl.querySelector<HTMLElement>('a, button')
          if (!linkEl) continue
          const child = validChildren[index]
          const key = String(child.key)

          const domRect = linkEl.getBoundingClientRect()
          const iconEl = linkEl.querySelector<HTMLElement>('[data-component="icon"]')

          let iconWidthWithMargin = 0
          if (iconEl) {
            const style = getComputedStyle(iconEl)
            iconWidthWithMargin =
              iconEl.getBoundingClientRect().width +
              (parseFloat(style.marginRight) || 0) +
              (parseFloat(style.marginLeft) || 0)
          }

          widths.set(key, domRect.width)
          noIconWidths.set(key, domRect.width - iconWidthWithMargin)
        }

        childWidthsRef.current = widths
        noIconChildWidthsRef.current = noIconWidths

        const navWidth = navEl.getBoundingClientRect().width
        if (navWidth === 0) return
        const moreMenuWidth = moreMenuRef.current?.getBoundingClientRect().width ?? 0
        const result = computeOverflow(navWidth, moreMenuWidth, validChildren, widths, noIconWidths)
        next = {
          items: result.items,
          menuItems: result.menuItems,
          iconsVisible: result.iconsVisible,
          measured: true,
          childrenKey: overflowState.childrenKey,
        }
      }

      // Pass 2: external-aria-current promotion. Operates on the freshest
      // (post-measurement) items so it can fold into the same setState.
      const considered: OverflowState = next ?? overflowState
      if (considered.measured && considered.items.length > 0) {
        // Look at FRESH props (current aria-current) by remapping through
        // validChildrenByKey (O(1) per lookup; the previous .find() pattern was
        // O(N) and ran inside a .map() — quadratic on every commit).
        const freshMenuItems = considered.menuItems.map(item => validChildrenByKey.get(String(item.key)) ?? item)
        const indexOfCurrent = freshMenuItems.findIndex(item => {
          const c = item.props['aria-current']
          return Boolean(c) && c !== 'false'
        })
        if (indexOfCurrent !== -1) {
          const swap = computeSwap(considered.items, freshMenuItems, freshMenuItems[indexOfCurrent], indexOfCurrent)
          next = {
            items: swap.items,
            menuItems: swap.menuItems,
            iconsVisible: false,
            measured: true,
            childrenKey: considered.childrenKey,
          }
        }
      }

      if (next) setOverflowState(next)
    })

    const closeOverlay = React.useCallback(() => {
      setIsWidgetOpen(false)
    }, [setIsWidgetOpen])

    const focusOnMoreMenuBtn = React.useCallback(() => {
      moreMenuBtnRef.current?.focus()
    }, [])

    const onAnchorClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
      if (event.defaultPrevented || event.button !== 0) {
        return
      }
      setIsWidgetOpen(isWidgetOpen => !isWidgetOpen)
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

    useResizeObserver((resizeObserverEntries: ResizeObserverEntry[]) => {
      const navWidth = resizeObserverEntries[0].contentRect.width
      if (navWidth === 0) return
      const moreMenuWidth = moreMenuRef.current?.getBoundingClientRect().width ?? 0
      const result = computeOverflow(
        navWidth,
        moreMenuWidth,
        validChildren,
        childWidthsRef.current,
        noIconChildWidthsRef.current,
      )
      setOverflowState(prev => ({
        items: result.items,
        menuItems: result.menuItems,
        iconsVisible: result.iconsVisible,
        measured: childWidthsRef.current.size > 0 || prev.measured,
        childrenKey: prev.childrenKey,
      }))
    }, navRef as RefObject<HTMLElement>)

    // Menu anchor position. `undefined` means "use the default right: 0 from
    // baseMenuInlineStyles" (the list is wide enough that no anchoring is
    // needed). A number means the menu is anchored to that `left` coordinate,
    // overriding right.
    //
    // This used to be computed inline during render by reading
    // containerRef.current / listRef.current — refs are mutable and unsafe to
    // read during render under concurrent rendering (the first render saw null
    // refs and fell through to the unanchored fallback; subsequent renders
    // anchored differently, producing a perceptible reflow).
    const [menuAnchorLeft, setMenuAnchorLeft] = useState<number | undefined>(undefined)
    useIsomorphicLayoutEffect(() => {
      const container = containerRef.current
      const list = listRef.current
      if (!container || !list) return
      if (list.clientWidth >= baseMenuMinWidth) {
        if (menuAnchorLeft !== undefined) setMenuAnchorLeft(undefined)
        return
      }
      const {left} = getAnchoredPosition(container, list, {
        align: 'start',
        side: 'outside-bottom',
      })
      if (menuAnchorLeft !== left) setMenuAnchorLeft(left)
    }, [isWidgetOpen, isOverflowMeasured, menuItems.length, menuAnchorLeft])

    // Stable context value: a fresh object literal here would re-render every
    // consumer (UnderlineNav.Item) on every parent re-render, undoing the
    // React.memo on UnderlineNavItem.
    const contextValue = useMemo(() => ({loadingCounters, iconsVisible}), [loadingCounters, iconsVisible])

    const menuStyle: React.CSSProperties =
      menuAnchorLeft !== undefined
        ? {...baseMenuInlineStyles, right: undefined, left: menuAnchorLeft, display: isWidgetOpen ? 'block' : 'none'}
        : {...baseMenuInlineStyles, display: isWidgetOpen ? 'block' : 'none'}

    return (
      <UnderlineNavContext.Provider value={contextValue}>
        {ariaLabel && <VisuallyHidden as="h2">{`${ariaLabel} navigation`}</VisuallyHidden>}
        <UnderlineWrapper
          as={as}
          aria-label={ariaLabel}
          className={className}
          ref={navRef}
          data-variant={variant}
          data-overflow-measured={isOverflowMeasured ? 'true' : 'false'}
        >
          <UnderlineItemList ref={listRef} role="list">
            {listItems}
            {menuItems.length > 0 && (
              <li ref={moreMenuRef} style={{display: 'flex', alignItems: 'center', height: `${MORE_BTN_HEIGHT}px`}}>
                {!onlyMenuVisible && <div style={dividerStyles}></div>}
                <Button
                  ref={moreMenuBtnRef}
                  className={classes.MoreButton}
                  aria-controls={disclosureWidgetId}
                  aria-expanded={isWidgetOpen}
                  onClick={onAnchorClick}
                  trailingAction={TriangleDownIcon}
                >
                  <span>
                    {onlyMenuVisible ? (
                      <>
                        <VisuallyHidden as="span">{`${ariaLabel}`}&nbsp;</VisuallyHidden>Menu
                      </>
                    ) : (
                      <>
                        More<VisuallyHidden as="span">&nbsp;{`${ariaLabel} items`}</VisuallyHidden>
                      </>
                    )}
                  </span>
                </Button>
                <ActionList selectionVariant="single" ref={containerRef} id={disclosureWidgetId} style={menuStyle}>
                  {menuItems.map((menuItem, index) => {
                    const {
                      children: menuItemChildren,
                      counter,
                      // Stripped from the spread below; the swap effect reads aria-current
                      // directly from item.props (not via these destructured locals).
                      // eslint-disable-next-line @typescript-eslint/no-unused-vars
                      'aria-current': _ariaCurrent,
                      onSelect,
                      ...menuItemProps
                    } = menuItem.props

                    return (
                      <ActionList.LinkItem
                        key={String(menuItem.key)}
                        style={menuItemStyles}
                        onClick={(
                          event: React.MouseEvent<HTMLAnchorElement> | React.KeyboardEvent<HTMLAnchorElement>,
                        ) => {
                          // When there are no items in the list, do not run the swap function as we want to keep everything in the menu.
                          !onlyMenuVisible && swapMenuItemWithListItem(menuItem, index)
                          closeOverlay()
                          focusOnMoreMenuBtn()
                          // fire onSelect event that comes from the UnderlineNav.Item (if it is defined)
                          typeof onSelect === 'function' && onSelect(event)
                        }}
                        {...menuItemProps}
                      >
                        <span className={classes.MenuItemContent}>
                          {menuItemChildren}
                          {loadingCounters ? (
                            <LoadingCounter />
                          ) : (
                            counter !== undefined && (
                              <span data-component="counter">
                                <CounterLabel>{counter}</CounterLabel>
                              </span>
                            )
                          )}
                        </span>
                      </ActionList.LinkItem>
                    )
                  })}
                </ActionList>
              </li>
            )}
          </UnderlineItemList>
        </UnderlineWrapper>
      </UnderlineNavContext.Provider>
    )
  },
)

UnderlineNav.displayName = 'UnderlineNav'
