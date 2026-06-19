import type {RefObject} from 'react'
import type React from 'react'
import {forwardRef, useMemo, useRef, useState} from 'react'
import VisuallyHidden from '../_VisuallyHidden'
import {ActionList} from '../ActionList'
import {ActionMenu} from '../ActionMenu'
import CounterLabel from '../CounterLabel'
import {LoadingCounter, UnderlineItemList, UnderlineWrapper} from '../internal/components/UnderlineTabbedInterface'
import {invariant} from '../utils/invariant'
import classes from './UnderlineNav.module.css'
import {UnderlineNavContext} from './UnderlineNavContext'
import {UnderlineNavItemsRegistry, type UnderlineNavItemProps} from './UnderlineNavItemsRegistry'
import {SkeletonText} from '../SkeletonText'
import {clsx} from 'clsx'
import {useDevOnlyEffect} from '../internal/hooks/useDevOnlyEffect'
import {getValidChildren, isCurrent} from './utils'

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
    const [hasEverOverflowed, setHasOverflowed] = useState(false)

    const [registeredItems, setRegisteredItems] = UnderlineNavItemsRegistry.useRegistryState()

    const overflowMenuItems = Array.from(registeredItems?.entries() ?? []).filter(
      (entry): entry is [string, UnderlineNavItemProps] => entry[1] !== null,
    )

    const isOverflowing = overflowMenuItems.length > 0
    if (isOverflowing && !hasEverOverflowed) setHasOverflowed(true)

    // Find the current item if it has overflowed into the menu, so we can reflect
    // its "current" state on the overflow menu anchor.
    const overflowingCurrentItem = overflowMenuItems.some(([, itemProps]) => isCurrent(itemProps))

    const validChildren = getValidChildren(children)

    useDevOnlyEffect(() => {
      // Address illegal state where there are multiple items that have `aria-current='page'` attribute
      const activeElements = validChildren.filter(child => isCurrent(child.props))
      invariant(activeElements.length <= 1, 'Only one current element is allowed')
      invariant(ariaLabel, 'Use the `aria-label` prop to provide an accessible label for assistive technology')
    }, [validChildren, ariaLabel])

    const contextValue = useMemo(
      () => ({
        loadingCounters,
      }),
      [loadingCounters],
    )

    const [menuOpen, setMenuOpen] = useState(false)

    // Edge case to avoid empty menu: close the menu if it's open but there's no longer an overflow (window resized or items removed)
    if (menuOpen && !isOverflowing) setMenuOpen(false)

    return (
      <UnderlineNavContext.Provider value={contextValue}>
        {ariaLabel && <VisuallyHidden as="h2">{`${ariaLabel} navigation`}</VisuallyHidden>}
        <UnderlineWrapper
          as={as}
          aria-label={ariaLabel}
          className={clsx(classes.UnderlineWrapper, className)}
          ref={navRef}
          data-variant={variant}
          data-overflow-mode="wrap"
          // Force icons to stay hidden, avoiding flickering as icons create/remove overflow
          data-hide-icons={hasEverOverflowed ? 'true' : undefined}
          // Ensure button is shown (after initial render) on browsers that don't support scroll-driven animations
          data-has-overflow={isOverflowing ? 'true' : undefined}
        >
          <UnderlineItemList ref={listRef} role="list" className={classes.ItemsList}>
            <UnderlineNavItemsRegistry.Provider setRegistry={setRegisteredItems}>
              {children}
            </UnderlineNavItemsRegistry.Provider>
          </UnderlineItemList>

          <div className={classes.MoreButtonContainer}>
            <div className={classes.MoreButtonDivider} />

            <ActionMenu open={menuOpen} onOpenChange={setMenuOpen}>
              <ActionMenu.Button
                className={classes.MoreButton}
                variant="invisible"
                data-component="overflow-menu-button"
                data-current={overflowingCurrentItem ? 'true' : undefined}
                aria-label={overflowingCurrentItem ? `More items, including current item` : undefined}
              >
                <span>
                  More<VisuallyHidden as="span"> items</VisuallyHidden>
                </span>
              </ActionMenu.Button>

              <ActionMenu.Overlay>
                <ActionList>
                  {registeredItems === undefined ? (
                    <ActionList.Item>
                      <SkeletonText />
                    </ActionList.Item>
                  ) : (
                    overflowMenuItems.map(([key, allProps]) => {
                      const {children: menuItemChildren, counter, onSelect, ...menuItemProps} = allProps

                      return (
                        <ActionList.LinkItem
                          key={key}
                          className={classes.OverflowMenuItem}
                          onClick={event => onSelect?.(event)}
                          {...(menuItemProps as Omit<typeof menuItemProps, 'as'>)}
                        >
                          <span className={classes.OverflowMenuItemLabel}>{menuItemChildren}</span>

                          {loadingCounters ? (
                            <ActionList.TrailingVisual>
                              <LoadingCounter />
                            </ActionList.TrailingVisual>
                          ) : (
                            counter !== undefined && (
                              <ActionList.TrailingVisual>
                                <span data-component="counter">
                                  <CounterLabel>{counter}</CounterLabel>
                                </span>
                              </ActionList.TrailingVisual>
                            )
                          )}
                        </ActionList.LinkItem>
                      )
                    })
                  )}
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
