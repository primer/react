import React, {forwardRef, useLayoutEffect, useRef, useContext, MutableRefObject, RefObject} from 'react'
import Box from '../Box'
import {merge, SxProp} from '../sx'
import {IconProps} from '@primer/octicons-react'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {UnderlineNavContext} from './UnderlineNavContext'
import CounterLabel from '../CounterLabel'
import {getLinkStyles, wrapperStyles, iconWrapStyles, counterStyles} from './styles'
import {LoadingCounter} from './LoadingCounter'

// adopted from React.AnchorHTMLAttributes
type LinkProps = {
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
   * Primary content for an NavLink
   */
  children?: React.ReactNode
  /**
   * Callback that will trigger both on click selection and keyboard selection.
   */
  onSelect?: (event: React.MouseEvent<HTMLLIElement> | React.KeyboardEvent<HTMLLIElement>) => void
  /**
   * Is the `Link` is currently selected?
   */
  selected?: boolean
  /**
   *  Icon before the text
   */
  icon?: React.FunctionComponent<IconProps>
  as?: React.ElementType
  /**
   * Counter
   */
  counter?: number | string
} & SxProp &
  LinkProps

export const UnderlineNavItem = forwardRef(
  (
    {
      sx: sxProp = {},
      as: Component = 'a',
      href = '#',
      children,
      counter,
      onSelect,
      selected: preSelected = false,
      icon: Icon,
      ...props
    },
    forwardedRef
  ) => {
    const backupRef = useRef<HTMLElement>(null)
    const ref = (forwardedRef ?? backupRef) as RefObject<HTMLElement>
    const {
      theme,
      setChildrenWidth,
      setNoIconChildrenWidth,
      selectedLink,
      setSelectedLink,
      selectedLinkText,
      setSelectedLinkText,
      selectEvent,
      setAsNavItem,
      afterSelect,
      variant,
      loadingCounters,
      iconsVisible
    } = useContext(UnderlineNavContext)

    useLayoutEffect(() => {
      const domRect = (ref as MutableRefObject<HTMLElement>).current.getBoundingClientRect()

      const icon = Array.from((ref as MutableRefObject<HTMLElement>).current.children[0].children).find(
        child => child.getAttribute('data-component') === 'icon'
      )

      const content = Array.from((ref as MutableRefObject<HTMLElement>).current.children[0].children).find(
        child => child.getAttribute('data-component') === 'text'
      ) as HTMLElement
      const text = content.textContent as string

      const iconWidthWithMargin = icon
        ? icon.getBoundingClientRect().width +
          Number(getComputedStyle(icon).marginRight.slice(0, -2)) +
          Number(getComputedStyle(icon).marginLeft.slice(0, -2))
        : 0

      setChildrenWidth({text, width: domRect.width})
      setNoIconChildrenWidth({text, width: domRect.width - iconWidthWithMargin})
      preSelected && selectedLink === undefined && setSelectedLink(ref as RefObject<HTMLElement>)

      // Only runs when a menu item is selected (swapping the menu item with the list item to keep it visible)
      if (selectedLinkText === text) {
        setSelectedLink(ref as RefObject<HTMLElement>)
        if (typeof onSelect === 'function' && selectEvent !== null) onSelect(selectEvent)
        setSelectedLinkText('')
      }
      setAsNavItem(Component)
    }, [
      ref,
      preSelected,
      selectedLink,
      selectedLinkText,
      setSelectedLinkText,
      setSelectedLink,
      setChildrenWidth,
      setNoIconChildrenWidth,
      onSelect,
      selectEvent,
      setAsNavItem,
      Component
    ])

    const keyPressHandler = React.useCallback(
      event => {
        if (!event.defaultPrevented && [' ', 'Enter'].includes(event.key)) {
          if (typeof onSelect === 'function') onSelect(event)
          if (typeof afterSelect === 'function') afterSelect(event)
        }
        setSelectedLink(ref as RefObject<HTMLElement>)
      },
      [onSelect, afterSelect, ref, setSelectedLink]
    )
    const clickHandler = React.useCallback(
      event => {
        if (!event.defaultPrevented) {
          if (typeof onSelect === 'function') onSelect(event)
          if (typeof afterSelect === 'function') afterSelect(event)
        }
        setSelectedLink(ref as RefObject<HTMLElement>)
      },
      [onSelect, afterSelect, ref, setSelectedLink]
    )

    return (
      <Box as="li" sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Box
          as={Component}
          href={href}
          onKeyPress={keyPressHandler}
          onClick={clickHandler}
          {...(selectedLink === ref ? {'aria-current': 'page'} : {})}
          sx={merge(getLinkStyles(theme, {variant}, selectedLink, ref), sxProp as SxProp)}
          {...props}
          ref={ref}
        >
          <Box as="div" data-component="wrapper" sx={wrapperStyles}>
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
                sx={selectedLink === ref ? {fontWeight: 600} : {}}
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
          </Box>
        </Box>
      </Box>
    )
  }
) as PolymorphicForwardRefComponent<'a', UnderlineNavItemProps>
