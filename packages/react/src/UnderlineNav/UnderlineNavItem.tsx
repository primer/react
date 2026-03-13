import React, {forwardRef, useRef, useContext} from 'react'
import type {IconProps} from '@primer/octicons-react'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {UnderlineNavContext} from './UnderlineNavContext'
import {UnderlineItem} from '../internal/components/UnderlineTabbedInterface'
import classes from './UnderlineNavItem.module.css'
import useIsomorphicLayoutEffect from '../utils/useIsomorphicLayoutEffect'

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

function scrollIntoViewHorizontally(container: HTMLElement, descendant: HTMLElement): void {
  // Walk up the offset parent chain to get the true left offset relative to `container`
  let offsetLeft = 0
  let el: HTMLElement | null = descendant
  while (el && el !== container) {
    offsetLeft += el.offsetLeft
    el = el.offsetParent as HTMLElement | null
  }

  // scrollIntoView would be more convenient but would scroll the entire page unless we pass `options.container`,
  // for which browser support is very limited
  const descendantLeft = offsetLeft - container.scrollLeft
  const descendantRight = descendantLeft + descendant.offsetWidth

  const containerWidth = container.clientWidth

  if (descendantLeft < 0) container.scrollLeft += descendantLeft
  else if (descendantRight > containerWidth) container.scrollLeft += descendantRight - containerWidth
}

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

  useIsomorphicLayoutEffect(() => {
    if (ariaCurrent && ariaCurrent !== 'false' && ref.current) {
      const scrollContainer = ref.current.closest('[data-component="underlinenav-scrollcontainer"]')
      if (!(scrollContainer instanceof HTMLElement)) return

      scrollIntoViewHorizontally(scrollContainer, ref.current)
    }
  }, [ariaCurrent])

  return (
    <li className={classes.UnderlineNavItem} ref={ref}>
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
      >
        {children}
      </UnderlineItem>
    </li>
  )
}) as PolymorphicForwardRefComponent<'a', UnderlineNavItemProps>

UnderlineNavItem.displayName = 'UnderlineNavItem'
