import type {MutableRefObject, RefObject} from 'react'
import React, {forwardRef, useRef, useContext} from 'react'
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
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: React.FunctionComponent<IconProps> | React.ReactElement<any>
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
    {as: Component = 'a', href = '#', children, counter, onSelect, 'aria-current': ariaCurrent, icon: Icon, ...props},
    forwardedRef,
  ) => {
    const backupRef = useRef<HTMLElement>(null)
    const ref = (forwardedRef ?? backupRef) as RefObject<HTMLAnchorElement>
    const {setChildrenWidth, setNoIconChildrenWidth, loadingCounters, iconsVisible} = useContext(UnderlineNavContext)

    useLayoutEffect(() => {
      if (ref.current) {
        const domRect = (ref as MutableRefObject<HTMLElement>).current.getBoundingClientRect()

        const icon = Array.from((ref as MutableRefObject<HTMLElement>).current.children).find(
          child => child.getAttribute('data-component') === 'icon',
        )

        const content = Array.from((ref as MutableRefObject<HTMLElement>).current.children).find(
          child => child.getAttribute('data-component') === 'text',
        ) as HTMLElement
        const text = content.textContent as string

        const iconWidthWithMargin = icon
          ? icon.getBoundingClientRect().width +
            Number(getComputedStyle(icon).marginRight.slice(0, -2)) +
            Number(getComputedStyle(icon).marginLeft.slice(0, -2))
          : 0

        setChildrenWidth({text, width: domRect.width})
        setNoIconChildrenWidth({text, width: domRect.width - iconWidthWithMargin})
      }
    }, [ref, setChildrenWidth, setNoIconChildrenWidth])

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
          icon={Icon}
          loadingCounters={loadingCounters}
          iconsVisible={iconsVisible}
          {...props}
        >
          {children}
        </UnderlineItem>
      </li>
    )
  },
) as PolymorphicForwardRefComponent<'a', UnderlineNavItemProps>

UnderlineNavItem.displayName = 'UnderlineNavItem'
