import type {RefObject} from 'react'
import React, {forwardRef, useRef, useContext} from 'react'
import type {IconProps} from '@primer/octicons-react'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {UnderlineNavContext} from './UnderlineNavContext'
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

export const UnderlineNavItem = forwardRef(
  (
    {
      as: Component = 'a',
      href = '#',
      children,
      counter,
      onSelect,
      'aria-current': ariaCurrent,
      'aria-hidden': ariaHidden,
      icon: Icon,
      leadingVisual,
      ...props
    },
    forwardedRef,
  ) => {
    const backupRef = useRef<HTMLElement>(null)
    const ref = (forwardedRef ?? backupRef) as RefObject<HTMLAnchorElement>
    const {loadingCounters} = useContext(UnderlineNavContext)

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

    // When aria-hidden is set (overflow items), hide the <li> from a11y tree
    // and make the inner element non-focusable
    const isHidden = ariaHidden === 'true' || ariaHidden === true

    return (
      <li className={classes.UnderlineNavItem} aria-hidden={isHidden || undefined}>
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
          tabIndex={isHidden ? -1 : undefined}
          {...props}
        >
          {children}
        </UnderlineItem>
      </li>
    )
  },
) as PolymorphicForwardRefComponent<'a', UnderlineNavItemProps>

UnderlineNavItem.displayName = 'UnderlineNavItem'
