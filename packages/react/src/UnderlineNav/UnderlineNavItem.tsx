import React, {forwardRef, useContext} from 'react'
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

  const {loadingCounters} = useContext(UnderlineNavContext)

  // Observe the wrapping `<li>` directly so a root-scoped IntersectionObserver can detect when the item is clipped
  // onto the hidden next row.
  const [isOverflowing, registerOverflowRef] = UnderlineNavItemsRegistry.useRegisterOverflowObserver()

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
    <li
      className={classes.UnderlineNavItem}
      ref={registerOverflowRef}
      aria-hidden={isOverflowing ? true : allProps['aria-hidden']}
    >
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
