import React, {forwardRef, useRef, useContext} from 'react'
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

  const {loadingCounters} = useContext(UnderlineNavContext)

  // Subscribe to the registry's shared IntersectionObserver. The observer is just being used as a trigger to
  // re-check `offsetTop > 0`; this is fast and simpler than checking visibility from the observed entry. When an
  // item wraps, it moves to the next (clipped) row, which increases its `offsetTop`.
  const isOverflowing = UnderlineNavItemsRegistry.useRegisterOverflowObserver(ref)

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
