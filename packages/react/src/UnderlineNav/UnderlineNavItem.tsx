import type {RefObject} from 'react'
import React, {forwardRef, useRef, useContext, memo, useEffect, useId, useState} from 'react'
import type {IconProps} from '@primer/octicons-react'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {UnderlineNavContext} from './UnderlineNavContext'
import useLayoutEffect from '../utils/useIsomorphicLayoutEffect'
import {UnderlineItem} from '../internal/components/UnderlineTabbedInterface'
import classes from './UnderlineNavItem.module.css'

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

export const UnderlineNavItem = memo(
  forwardRef((allProps, forwardedRef) => {
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

    const backupRef = useRef<HTMLElement>(null)
    const ref = (forwardedRef ?? backupRef) as RefObject<HTMLAnchorElement>
    const {loadingCounters, containerWidth, registerItem, unregisterItem} = useContext(UnderlineNavContext)

    const id = useId()
    const [isOverflowing, setIsOverflowing] = useState(false)

    useLayoutEffect(() => {
      if (ref.current) {
        const isOverflowing = ref.current.offsetTop > 0
        setIsOverflowing(isOverflowing)
        registerItem(id, isOverflowing ? allProps : null)
      }
    }, [ref, containerWidth, registerItem, id, allProps])

    useEffect(() => () => unregisterItem(id), [id, unregisterItem])

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
  }) as PolymorphicForwardRefComponent<'a', UnderlineNavItemProps>,
)

UnderlineNavItem.displayName = 'UnderlineNavItem'
