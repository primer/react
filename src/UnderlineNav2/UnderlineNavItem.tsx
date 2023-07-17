import React, {forwardRef, useRef, useContext, MutableRefObject, RefObject} from 'react'
import Box from '../Box'
import {merge, SxProp, BetterSystemStyleObject} from '../sx'
import {IconProps} from '@primer/octicons-react'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
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
  /**
   * If true, the item will be in a current mode.
   * This is equivalent to setting `aria-current=true`.
   * It is used for simple navigation items wit and internal select state management.
   */
  defaultCurrent?: boolean
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
      defaultCurrent,
      ...props
    },
    forwardedRef,
  ) => {
    const backupRef = useRef<HTMLElement>(null)
    const ref = (forwardedRef ?? backupRef) as RefObject<HTMLAnchorElement>
    const {
      theme,
      setChildrenWidth,
      setNoIconChildrenWidth,
      currentItem,
      setCurrentItem,
      loadingCounters,
      iconsVisible,
      actionSwapKey,
      setActionSwapKey,
    } = useContext(UnderlineNavContext)

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
        // console.log(actionSwapKey, currentItem)
        // initial load - current item is undefined. We need to set it to the first item with aria-current=true
        if (currentItem === undefined && (defaultCurrent || (Boolean(ariaCurrent) && ariaCurrent !== 'false'))) {
          setCurrentItem(ref as RefObject<HTMLElement>)
        } else if (actionSwapKey !== undefined) {
          setCurrentItem(ref as RefObject<HTMLElement>)
          setActionSwapKey(undefined)
        }
      }
    }, [
      ref,
      setChildrenWidth,
      setNoIconChildrenWidth,
      currentItem,
      setCurrentItem,
      ariaCurrent,
      defaultCurrent,
      actionSwapKey,
      setActionSwapKey,
    ])

    const keyDownHandler = React.useCallback(
      (event: React.KeyboardEvent<HTMLAnchorElement>) => {
        if ((event.key === ' ' || event.key === 'Enter') && !event.defaultPrevented && typeof onSelect === 'function') {
          onSelect(event)
        }
        setCurrentItem(ref as RefObject<HTMLElement>)
      },
      [onSelect, setCurrentItem, ref],
    )
    const clickHandler = React.useCallback(
      (event: React.MouseEvent<HTMLAnchorElement>) => {
        if (!event.defaultPrevented && typeof onSelect === 'function') {
          onSelect(event)
        }
        setCurrentItem(ref as RefObject<HTMLElement>)
      },
      [onSelect, setCurrentItem, ref],
    )

    return (
      <Link
        ref={ref}
        as={Component}
        href={href}
        aria-current={currentItem === ref ? ariaCurrent || 'page' : undefined}
        onKeyDown={keyDownHandler}
        onClick={clickHandler}
        sx={merge<BetterSystemStyleObject>(getLinkStyles(theme, currentItem, ref), sxProp as SxProp)}
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
            sx={currentItem === ref ? {fontWeight: 600} : {}}
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
    )
  },
) as PolymorphicForwardRefComponent<'a', UnderlineNavItemProps>

UnderlineNavItem.displayName = 'UnderlineNavItem'
