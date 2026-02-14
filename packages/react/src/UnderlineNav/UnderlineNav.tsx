import type {RefObject} from 'react'
import React, {useRef, forwardRef, useCallback, useState, useEffect, useMemo} from 'react'
import {UnderlineNavContext} from './UnderlineNavContext'
import VisuallyHidden from '../_VisuallyHidden'
import {UnderlineItemList, UnderlineWrapper, LoadingCounter} from '../internal/components/UnderlineTabbedInterface'
import {Button} from '../Button'
import {TriangleDownIcon} from '@primer/octicons-react'
import {useOnEscapePress} from '../hooks/useOnEscapePress'
import {useOnOutsideClick} from '../hooks/useOnOutsideClick'
import {useId} from '../hooks/useId'
import {ActionList} from '../ActionList'
import CounterLabel from '../CounterLabel'
import {invariant} from '../utils/invariant'
import {clsx} from 'clsx'
import classes from './UnderlineNav.module.css'

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

// Threshold for considering an item "fully visible" in IntersectionObserver
const VISIBILITY_THRESHOLD = 0.95

const getValidChildren = (children: React.ReactNode) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return React.Children.toArray(children).filter(child => React.isValidElement(child)) as React.ReactElement<any>[]
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
    const moreMenuBtnRef = useRef<HTMLButtonElement>(null)
    const menuListRef = useRef<HTMLUListElement>(null)
    const disclosureWidgetId = useId()

    const [isWidgetOpen, setIsWidgetOpen] = useState(false)
    // Track icon visibility in a ref (not state) — toggling is done via CSS data attribute
    // on the wrapper, avoiding React re-render cycles.
    const iconsVisibleRef = useRef(true)
    // Index from which items overflow (-1 = no overflow).
    // All items from this index onward are clipped by CSS and duplicated in the overflow menu.
    const [overflowStartIndex, setOverflowStartIndex] = useState<number>(-1)
    // Tracks whether IO has completed its first determination.
    // Before this, the More button is rendered with visibility: hidden to prevent CLS.
    const ioReadyRef = useRef(false)

    const validChildren = useMemo(() => getValidChildren(children), [children])

    const hasOverflow = overflowStartIndex >= 0 && overflowStartIndex < validChildren.length
    // When the viewport is too narrow to show any list item. Only the dropdown is shown.
    const onlyMenuVisible = overflowStartIndex === 0

    // Phase tracking for icon toggle to prevent infinite loops:
    // 'normal' - stable state
    // 'trying-without-icons' - just hid icons, waiting for IO to re-fire
    // 'trying-with-icons' - trying to re-enable icons (container grew), waiting for IO
    const iconPhaseRef = useRef<'normal' | 'trying-without-icons' | 'trying-with-icons'>('normal')

    // Tracks the list width when icons were last disabled due to overflow.
    // Icons will only be retried when the list grows beyond this width.
    const widthWhenIconsDisabledRef = useRef(0)

    // Visibility map for IntersectionObserver — tracks each element's intersection state
    const visibilityMapRef = useRef(new Map<Element, boolean>())

    if (__DEV__) {
      // Practically, this is not a conditional hook, it is just making sure this hook runs only on DEV not PROD.
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useEffect(() => {
        // Address illegal state where there are multiple items that have `aria-current='page'` attribute
        const activeElements = validChildren.filter(child => {
          return child.props['aria-current'] !== undefined
        })
        invariant(activeElements.length <= 1, 'Only one current element is allowed')
        invariant(ariaLabel, 'Use the `aria-label` prop to provide an accessible label for assistive technology')
      })
    }

    // Compute display items with aria-current swap.
    // All items are always rendered in the list (CSS clips overflow).
    // If the aria-current item is in the overflow range, swap it with the last visible item.
    const [displayItems, menuItems] = useMemo(() => {
      if (!hasOverflow) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return [validChildren, [] as React.ReactElement<any>[]]
      }

      const items = [...validChildren]

      // Collect overflow items
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const overflow: React.ReactElement<any>[] = []
      for (let i = overflowStartIndex; i < items.length; i++) {
        overflow.push(items[i])
      }

      // Check if aria-current item is in the overflow range
      const currentOverflowIdx = overflow.findIndex(child => {
        const ac = child.props['aria-current']
        return Boolean(ac) && ac !== 'false'
      })

      if (currentOverflowIdx !== -1 && overflowStartIndex > 0) {
        // Swap current item with the last visible item to keep it in view
        const itemIdxInFull = overflowStartIndex + currentOverflowIdx
        const lastVisibleIdx = overflowStartIndex - 1
        ;[items[itemIdxInFull], items[lastVisibleIdx]] = [items[lastVisibleIdx], items[itemIdxInFull]]
        // Update overflow array to reflect the swap
        overflow[currentOverflowIdx] = items[itemIdxInFull]
      }

      return [items, overflow]
    }, [validChildren, overflowStartIndex, hasOverflow])

    // IntersectionObserver-based overflow detection.
    // Uses CSS overflow: hidden on the list + IO to detect which items are clipped.
    // No forced reflows: IO fires asynchronously after layout.
    // Icon toggling is done via CSS data attribute (no React re-render needed).
    useEffect(() => {
      const list = listRef.current
      const wrapper = navRef.current
      if (!list || typeof IntersectionObserver === 'undefined' || typeof ResizeObserver === 'undefined') {
        return
      }

      // Helper to toggle icon visibility via CSS data attribute on the wrapper.
      // This avoids a React re-render cycle — the browser relayouts and IO re-fires.
      const setIconsVisible = (visible: boolean) => {
        iconsVisibleRef.current = visible
        wrapper?.setAttribute('data-icons-visible', String(visible))
      }

      // Ensure the initial attribute matches the ref
      wrapper?.setAttribute('data-icons-visible', String(iconsVisibleRef.current))

      // Clear visibility map on each observer setup
      visibilityMapRef.current.clear()

      const observer = new IntersectionObserver(
        entries => {
          // Update visibility map with new entries
          for (const entry of entries) {
            visibilityMapRef.current.set(entry.target, entry.intersectionRatio >= VISIBILITY_THRESHOLD)
          }

          // Find the first non-visible nav item (skip anchor markers)
          const navItems = Array.from(list.children).filter(child => !child.hasAttribute('data-anchor-marker'))
          let firstOverflow = -1
          for (let i = 0; i < navItems.length; i++) {
            if (visibilityMapRef.current.get(navItems[i]) === false) {
              firstOverflow = i
              break
            }
          }

          const hasOverflowNow = firstOverflow !== -1
          ioReadyRef.current = true

          if (hasOverflowNow) {
            if (iconPhaseRef.current === 'trying-with-icons') {
              // We tried re-enabling icons but they don't fit. Revert.
              setIconsVisible(false)
              iconPhaseRef.current = 'normal'
              // Remember this width so we don't retry until the list grows
              widthWhenIconsDisabledRef.current = list.clientWidth
              return
            }

            if (iconsVisibleRef.current) {
              // First overflow with icons — try hiding icons to see if all items fit
              setIconsVisible(false)
              iconPhaseRef.current = 'trying-without-icons'
              // Remember the width for retry prevention
              widthWhenIconsDisabledRef.current = list.clientWidth
              return
            }

            if (iconPhaseRef.current === 'trying-without-icons') {
              iconPhaseRef.current = 'normal'
            }

            // Accessibility: never show only 1 item in the overflow menu.
            let adjustedFirstOverflow = firstOverflow
            const overflowCount = navItems.length - firstOverflow
            if (overflowCount === 1 && navItems.length > 1) {
              adjustedFirstOverflow = firstOverflow - 1
            }

            setOverflowStartIndex(adjustedFirstOverflow)
          } else {
            // All items are visible
            setOverflowStartIndex(-1)

            if (iconPhaseRef.current === 'trying-without-icons') {
              // Items fit without icons — stay without icons
              iconPhaseRef.current = 'normal'
            } else if (iconPhaseRef.current === 'trying-with-icons') {
              // Icons fit — keep them visible
              iconPhaseRef.current = 'normal'
            } else if (!iconsVisibleRef.current) {
              // Only retry icons if the list has actually grown since we disabled them
              const currentWidth = list.clientWidth
              if (currentWidth > widthWhenIconsDisabledRef.current + 20) {
                setIconsVisible(true)
                iconPhaseRef.current = 'trying-with-icons'
              }
            }
          }
        },
        {
          root: list,
          threshold: [0, VISIBILITY_THRESHOLD, 1],
        },
      )

      // Observe only nav item children (skip zero-size anchor markers)
      for (let i = 0; i < list.children.length; i++) {
        if (!list.children[i].hasAttribute('data-anchor-marker')) {
          observer.observe(list.children[i])
        }
      }

      // ResizeObserver to detect when the list grows while icons are hidden.
      // IO won't re-fire when all items are already fully visible and the root
      // just gets wider, so we need RO to trigger icon retry in that scenario.
      const resizeObserver = new ResizeObserver(() => {
        if (!iconsVisibleRef.current && iconPhaseRef.current === 'normal') {
          const currentWidth = list.clientWidth
          if (currentWidth > widthWhenIconsDisabledRef.current + 20) {
            setIconsVisible(true)
            iconPhaseRef.current = 'trying-with-icons'
          }
        }
      })
      resizeObserver.observe(list)

      return () => {
        observer.disconnect()
        resizeObserver.disconnect()
      }
    }, [validChildren, navRef])

    const closeOverlay = useCallback(() => {
      setIsWidgetOpen(false)
    }, [])

    const focusOnMoreMenuBtn = useCallback(() => {
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

    useOnOutsideClick({onClickOutside: closeOverlay, containerRef: menuListRef, ignoreClickRefs: [moreMenuBtnRef]})

    return (
      <UnderlineNavContext.Provider
        value={{
          loadingCounters,
        }}
      >
        {ariaLabel && <VisuallyHidden as="h2">{`${ariaLabel} navigation`}</VisuallyHidden>}
        <UnderlineWrapper
          as={as}
          aria-label={ariaLabel}
          className={clsx(className, classes.NavWrapper)}
          ref={navRef}
          data-variant={variant}
          data-icons-visible={iconsVisibleRef.current}
        >
          <UnderlineItemList ref={listRef} role="list" className={classes.OverflowList}>
            {displayItems.map((item, index) => {
              const isOverflowing = hasOverflow && index >= overflowStartIndex
              return (
                <React.Fragment key={item.key ?? index}>
                  {isOverflowing
                    ? React.cloneElement(item, {
                        'aria-hidden': 'true',
                      })
                    : item}
                  {/* Zero-size anchor marker after each item. The one at overflowStartIndex
                      is used as the CSS anchor for the More button positioning. */}
                  <li
                    aria-hidden="true"
                    data-anchor-marker=""
                    className={classes.AnchorMarker}
                    style={{anchorName: `--nav-anchor-${index}`} as React.CSSProperties}
                  />
                </React.Fragment>
              )
            })}
          </UnderlineItemList>
          {(hasOverflow || !ioReadyRef.current) && (
            <div
              className={clsx(classes.MoreMenuContainer, !hasOverflow && classes.MoreMenuHidden)}
              style={
                {
                  positionAnchor: overflowStartIndex > 0 ? `--nav-anchor-${overflowStartIndex - 1}` : undefined,
                } as React.CSSProperties
              }
            >
              {!onlyMenuVisible && <div className={classes.Divider}></div>}
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
              <ActionList
                selectionVariant="single"
                ref={menuListRef}
                id={disclosureWidgetId}
                className={clsx(classes.OverflowMenu, isWidgetOpen && classes.OverflowMenuOpen)}
              >
                {menuItems.map((menuItem, index) => {
                  const {children: menuItemChildren, counter, onSelect, ...menuItemProps} = menuItem.props

                  return (
                    <ActionList.LinkItem
                      key={menuItem.key ?? index}
                      className={classes.MenuItem}
                      onClick={(
                        event: React.MouseEvent<HTMLAnchorElement> | React.KeyboardEvent<HTMLAnchorElement>,
                      ) => {
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
            </div>
          )}
        </UnderlineWrapper>
      </UnderlineNavContext.Provider>
    )
  },
)

UnderlineNav.displayName = 'UnderlineNav'
