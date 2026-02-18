import type {RefObject} from 'react'
import React, {forwardRef, useCallback, useEffect, useRef, useState} from 'react'
import VisuallyHidden from '../_VisuallyHidden'
import {ActionList} from '../ActionList'
import {ActionMenu} from '../ActionMenu'
import CounterLabel from '../CounterLabel'
import type {ResizeObserverEntry} from '../hooks/useResizeObserver'
import {useResizeObserver} from '../hooks/useResizeObserver'
import {LoadingCounter, UnderlineItemList, UnderlineWrapper} from '../internal/components/UnderlineTabbedInterface'
import {invariant} from '../utils/invariant'
import {dividerStyles} from './styles'
import classes from './UnderlineNav.module.css'
import {UnderlineNavContext} from './UnderlineNavContext'
import type {UnderlineNavItemProps} from './UnderlineNavItem'

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
export const MORE_BTN_WIDTH = 86
// The height is needed to make sure we don't have a layout shift when the more button is the only item in the nav.
const MORE_BTN_HEIGHT = 32

export const getValidChildren = (children: React.ReactNode) => {
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

    /** Tracks whether any item has ever overflowed for the lifecycle of this component. Used to prevent flickering. */
    const [isOrEverHasOverflowed, setIsOrEverHasOverflowed] = useState(false)

    const [registeredItems, setRegisteredItems] = useState(() => new Map<string, UnderlineNavItemProps | null>())

    const registerItem = useCallback((id: string, menuItemProps: UnderlineNavItemProps | null) => {
      setRegisteredItems(prev => {
        if (menuItemProps === null && prev.get(id) === null) return prev

        if (menuItemProps !== null) setIsOrEverHasOverflowed(true)

        const copy = new Map(prev)
        copy.set(id, menuItemProps)
        return copy
      })
    }, [])

    const unregisterItem = useCallback((id: string) => {
      setRegisteredItems(prev => {
        if (!prev.has(id)) return prev

        const copy = new Map(prev)
        copy.delete(id)
        return copy
      })
    }, [])

    const validChildren = getValidChildren(children)

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

    const [containerWidth, setContainerWidth] = useState(-1)
    useResizeObserver((resizeObserverEntries: ResizeObserverEntry[]) => {
      setContainerWidth(resizeObserverEntries[0].contentRect.width)
    }, navRef)

    const menuItems = Array.from(registeredItems.entries()).filter(
      (entry): entry is [string, UnderlineNavItemProps] => entry[1] !== null,
    )

    return (
      <UnderlineNavContext.Provider
        value={{
          loadingCounters,
          registerItem,
          containerWidth,
          unregisterItem,
        }}
      >
        {ariaLabel && <VisuallyHidden as="h2">{`${ariaLabel} navigation`}</VisuallyHidden>}
        <UnderlineWrapper
          as={as}
          aria-label={ariaLabel}
          className={className}
          ref={navRef}
          data-variant={variant}
          // When the component is first rendered, we use a scroll-state CSS container query to determine whether to
          // hide icons. This works well for SSR where we can't have run any effects yet. But the pure CSS approach
          // can cause flickering because hiding the icons makes more space, allowing them to show, which fills that
          // space...so after that, if anything has ever wrapped, we just keep the icons hidden to prevent that flickering.
          data-hide-icons={isOrEverHasOverflowed ? 'true' : 'false'}
        >
          <UnderlineItemList ref={listRef} role="list">
            {children}
          </UnderlineItemList>

          <div
            style={{
              height: `${MORE_BTN_HEIGHT}px`,
            }}
            className={classes.MoreButtonContainer}
          >
            <div style={dividerStyles} />

            <ActionMenu>
              <ActionMenu.Button className={classes.MoreButton} disabled={menuItems.length === 0}>
                <span>
                  More<VisuallyHidden as="span">&nbsp; items</VisuallyHidden>
                </span>
              </ActionMenu.Button>

              <ActionMenu.Overlay>
                <ActionList>
                  {menuItems.map(([key, allProps]) => {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const {children: menuItemChildren, counter, as, onSelect, ...menuItemProps} = allProps

                    return (
                      <ActionList.LinkItem
                        key={key}
                        className={classes.OverflowMenuItem}
                        onClick={event => onSelect?.(event)}
                        {...menuItemProps}
                      >
                        <span className={classes.OverflowMenuItemLabel}>{menuItemChildren}</span>
                        <ActionList.TrailingVisual>
                          {loadingCounters ? (
                            <LoadingCounter />
                          ) : (
                            counter !== undefined && (
                              <span data-component="counter">
                                <CounterLabel>{counter}</CounterLabel>
                              </span>
                            )
                          )}
                        </ActionList.TrailingVisual>
                      </ActionList.LinkItem>
                    )
                  })}
                </ActionList>
              </ActionMenu.Overlay>
            </ActionMenu>
          </div>
        </UnderlineWrapper>
      </UnderlineNavContext.Provider>
    )
  },
)

UnderlineNav.displayName = 'UnderlineNav'
