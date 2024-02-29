import type {MutableRefObject, RefObject} from 'react'
import React, {forwardRef, useRef, useContext} from 'react'
import Box from '../Box'
import type {SxProp, BetterSystemStyleObject} from '../sx'
import {merge} from '../sx'
import type {IconProps} from '@primer/octicons-react'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {UnderlineNavContext} from './UnderlineNavContext'
import CounterLabel from '../CounterLabel'
import {getLinkStyles, iconWrapStyles, counterStyles} from './styles'
import {LoadingCounter} from './LoadingCounter'
import useLayoutEffect from '../utils/useIsomorphicLayoutEffect'
import {defaultSxProp} from '../utils/defaultSxProp'
import Link from '../Link'

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
  icon?: React.FunctionComponent<IconProps>
  /**
   * Renders `UnderlineNav.Item` as given component i.e. react-router's Link
   **/
  as?: React.ElementType | 'a'
  /**
   * Counter
   */
  counter?: number | string
} & SxProp &
  LinkProps

export const UnderlineNavItem = forwardRef(
  (
    {
      sx: sxProp = defaultSxProp,
      as: Component = 'a',
      href = '#',
      children,
      counter,
      onSelect,
      'aria-current': ariaCurrent,
      icon: Icon,
      ...props
    },
    forwardedRef,
  ) => {
    const backupRef = useRef<HTMLElement>(null)
    const ref = (forwardedRef ?? backupRef) as RefObject<HTMLAnchorElement>
    const {theme, setChildrenWidth, setNoIconChildrenWidth, loadingCounters, iconsVisible} =
      useContext(UnderlineNavContext)

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
      <Box as="li" sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Link
          ref={ref}
          as={Component}
          href={href}
          aria-current={ariaCurrent}
          onKeyDown={keyDownHandler}
          onClick={clickHandler}
          sx={merge<BetterSystemStyleObject>(getLinkStyles(theme, ariaCurrent), sxProp as SxProp)}
          {...props}
        >
          {iconsVisible && Icon && (
            <Box as="span" data-component="icon" sx={iconWrapStyles}>
              <Icon />
            </Box>
          )}
          {children && (
            <Box
              as="span"
              data-component="text"
              data-content={children}
              sx={Boolean(ariaCurrent) && ariaCurrent !== 'false' ? {fontWeight: 600} : {}}
            >
              {children}
            </Box>
          )}
          {loadingCounters ? (
            <Box as="span" data-component="counter" sx={counterStyles}>
              <LoadingCounter />
            </Box>
          ) : (
            counter !== undefined && (
              <Box as="span" data-component="counter" sx={counterStyles}>
                <CounterLabel>{counter}</CounterLabel>
              </Box>
            )
          )}
        </Link>
      </Box>
    )
  },
) as PolymorphicForwardRefComponent<'a', UnderlineNavItemProps>

UnderlineNavItem.displayName = 'UnderlineNavItem'
