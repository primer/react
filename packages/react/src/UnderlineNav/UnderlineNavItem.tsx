import React, {forwardRef, useRef, useContext, useCallback, useSyncExternalStore} from 'react'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {UnderlineNavContext} from './UnderlineNavContext'
import {UnderlineItem} from '../internal/components/UnderlineTabbedInterface'
import classes from './UnderlineNavItem.module.css'
import {type UnderlineNavItemProps, UnderlineNavItemsRegistry} from './UnderlineNavItemsRegistry'

export const UnderlineNavItem = forwardRef((allProps, forwardedRef) => {
  const {
    as: Component = 'a',
    href = '#',
    children,
    counter,
    onSelect,
    'aria-current': ariaCurrent,
    icon: Icon,
    leadingVisual,
    ...props
  } = allProps

  const ref = useRef<HTMLLIElement>(null)

  // Cached overflow state. `offsetTop` is read inside the IntersectionObserver
  // callback below (which runs *after* the browser has computed layout), so it
  // never forces a synchronous reflow. `getSnapshot` then just returns this
  // cached boolean. Reading `offsetTop` directly in `getSnapshot` — as this used
  // to — forces layout every time React calls it (during render, commit, and on
  // every store change, for every item), causing significant layout thrashing on
  // pages with many nav items.
  const isOverflowingRef = useRef(false)

  const {loadingCounters} = useContext(UnderlineNavContext)

  const isOverflowing = useSyncExternalStore(
    useCallback(onChange => {
      // The IntersectionObserver is a trigger to re-check whether the item has
      // wrapped to the next row (which increases its `offsetTop`) and is clipped
      // out of the single-row nav. Its callback runs after layout, so measuring
      // here is reflow-free. Only notify React when the overflow state changes.
      const observer = new IntersectionObserver(
        () => {
          const isOverflowingNow = ref.current ? ref.current.offsetTop > 0 : false
          if (isOverflowingNow !== isOverflowingRef.current) {
            isOverflowingRef.current = isOverflowingNow
            onChange()
          }
        },
        {
          threshold: 1,
        },
      )
      if (ref.current) observer.observe(ref.current)
      return () => observer.disconnect()
    }, []),
    () => isOverflowingRef.current,
    () => false,
  )

  UnderlineNavItemsRegistry.useRegisterDescendant(isOverflowing ? allProps : null)

  const keyDownHandler = React.useCallback(
    (event: React.KeyboardEvent<HTMLAnchorElement>) => {
      if ((event.key === ' ' || event.key === 'Enter') && !event.defaultPrevented && typeof onSelect === 'function') {
        onSelect(event)
      }
    },
    [onSelect],
  )
  const clickHandler = React.useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (!event.defaultPrevented && typeof onSelect === 'function') {
        onSelect(event)
      }
    },
    [onSelect],
  )

  return (
    <li className={classes.UnderlineNavItem} ref={ref} aria-hidden={isOverflowing ? true : allProps['aria-hidden']}>
      <UnderlineItem
        ref={forwardedRef}
        as={Component}
        href={href}
        aria-current={ariaCurrent}
        onKeyDown={keyDownHandler}
        onClick={clickHandler}
        counter={counter}
        icon={leadingVisual ?? Icon}
        loadingCounters={loadingCounters}
        {...props}
        tabIndex={isOverflowing ? -1 : allProps.tabIndex}
      >
        {children}
      </UnderlineItem>
    </li>
  )
}) as PolymorphicForwardRefComponent<'a', UnderlineNavItemProps>

UnderlineNavItem.displayName = 'UnderlineNavItem'
