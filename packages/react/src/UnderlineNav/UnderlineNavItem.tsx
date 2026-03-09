import React, {forwardRef, useRef, useContext, useCallback, useSyncExternalStore} from 'react'
import type {IconProps} from '@primer/octicons-react'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {UnderlineNavContext} from './UnderlineNavContext'
import {UnderlineItem} from '../internal/components/UnderlineTabbedInterface'
import classes from './UnderlineNavItem.module.css'
import {createDescendantRegistry} from '../utils/descendant-registry'
import {useRefObjectAsForwardedRef} from '../hooks'

// adopted from React.AnchorHTMLAttributes
export type LinkProps = {
  download?: string
  href?: string
  hrefLang?: string
  media?: string
  ping?: string
  rel?: string
  target?: string
  type?: string
  referrerPolicy?: React.AnchorHTMLAttributes<HTMLAnchorElement>['referrerPolicy']
}

export type UnderlineNavItemProps = {
  /**
   * Primary content for an UnderlineNav
   */
  children?: React.ReactNode

  /**
   * Callback that will trigger both on click selection and keyboard selection.
   */
  onSelect?: (event: React.MouseEvent<HTMLAnchorElement> | React.KeyboardEvent<HTMLAnchorElement>) => void

  /**
   * Is `UnderlineNav.Item` current page?
   */
  'aria-current'?: 'page' | 'step' | 'location' | 'date' | 'time' | 'true' | 'false' | boolean

  /**
   *  Icon before the text
   *  @deprecated Use the `leadingVisual` prop instead
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: React.FunctionComponent<IconProps> | React.ReactElement<any>

  /**
   * Render a visual before the text
   */
  leadingVisual?: React.ReactElement

  /**
   * Renders `UnderlineNav.Item` as given component i.e. react-router's Link
   **/
  as?: React.ElementType | 'a'

  /**
   * Counter
   */
  counter?: number | string
} & LinkProps

/** Registry of currently-overflowing underline items. If an item is not overflowing, its value will be `null`. */
export const UnderlineNavItemsRegistry = createDescendantRegistry<UnderlineNavItemProps | null>()

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

  const ref = useRef<HTMLAnchorElement>(null)
  useRefObjectAsForwardedRef(forwardedRef, ref)

  const {loadingCounters} = useContext(UnderlineNavContext)

  const isOverflowing = useSyncExternalStore(
    useCallback(
      onChange => {
        const observer = new IntersectionObserver(() => onChange(), {
          threshold: 1,
        })
        if (ref.current) observer.observe(ref.current)
        return () => observer.disconnect()
      },
      [ref],
    ),
    // Note: the IntersectionObserver is just being used as a trigger to re-check
    // `offsetTop > 0`; this is fast and simpler than checking visibility from
    // the observed entry. When an item wraps, it will move to the next row which
    // increases its `offsetTop`
    () => (ref.current ? ref.current.offsetTop > 0 : false),
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
    <li className={classes.UnderlineNavItem}>
      <UnderlineItem
        ref={ref}
        as={Component}
        href={href}
        aria-current={ariaCurrent}
        onKeyDown={keyDownHandler}
        onClick={clickHandler}
        counter={counter}
        icon={leadingVisual ?? Icon}
        loadingCounters={loadingCounters}
        {...props}
        aria-hidden={isOverflowing ? true : allProps['aria-hidden']}
        tabIndex={isOverflowing ? -1 : allProps.tabIndex}
      >
        {children}
      </UnderlineItem>
    </li>
  )
}) as PolymorphicForwardRefComponent<'a', UnderlineNavItemProps>

UnderlineNavItem.displayName = 'UnderlineNavItem'
