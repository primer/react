import React, {forwardRef, useLayoutEffect, useRef, useContext, MutableRefObject, RefObject} from 'react'
import Box from '../Box'
import {merge, SxProp, BetterSystemStyleObject} from '../sx'
import {IconProps} from '@primer/octicons-react'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {UnderlineNavContext} from './UnderlineNavContext'
import CounterLabel from '../CounterLabel'

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

export type UnderlineNavLinkProps = {
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
  leadingIcon?: React.FunctionComponent<IconProps>
  as?: React.ElementType
  /**
   * Counter
   */
  counter?: number
} & SxProp &
  LinkProps

export const UnderlineNavLink = forwardRef(
  (
    {
      sx: sxProp = {},
      as: Component = 'a',
      href = '#',
      children,
      counter,
      onSelect,
      selected: preSelected = false,
      leadingIcon: LeadingIcon,
      ...props
    },
    forwardedRef
  ) => {
    const backupRef = useRef<HTMLElement>(null)
    const ref = forwardedRef ?? backupRef
    const {setChildrenWidth, selectedLink, setSelectedLink, afterSelect, variant} = useContext(UnderlineNavContext)
    useLayoutEffect(() => {
      const domRect = (ref as MutableRefObject<HTMLElement>).current.getBoundingClientRect()
      setChildrenWidth({width: domRect.width})
      preSelected && selectedLink === undefined && setSelectedLink(ref as RefObject<HTMLElement>)
    }, [ref, preSelected, selectedLink, setSelectedLink, setChildrenWidth])
    const iconWrapStyles = {
      alignItems: 'center',
      display: 'inline-flex',
      marginRight: 2
    }

    const textStyles: BetterSystemStyleObject = {
      whiteSpace: 'nowrap'
    }

    // Styling the anchor tag
    const linkStyles = {
      display: 'inline-flex',
      color: 'fg.default',
      textAlign: 'center',
      textDecoration: 'none',
      paddingX: 2,
      paddingY: 1,
      ...(variant === 'small' ? {fontSize: 0} : {fontSize: 1}),
      '&:hover': {
        backgroundColor: 'neutral.muted',
        borderRadius: 2
      },
      '&:focus': {
        outlineColor: 'fg.accent',
        borderRadius: 2,
        transition: '0.2s ease'
      }
    }
    // Styling the li list item
    const listItemStyles = {
      ...(variant === 'small' ? {paddingY: 1} : {paddingY: 2}),
      borderBottom: '2px solid transparent',
      borderColor: selectedLink === ref ? 'primer.border.active' : 'transparent',
      marginRight: 3
    }
    const counterStyles = {
      marginLeft: 2
    }
    const keyPressHandler = React.useCallback(
      event => {
        if (!event.defaultPrevented && [' ', 'Enter'].includes(event.key)) {
          if (typeof onSelect === 'function') onSelect(event)
          if (typeof afterSelect === 'function') afterSelect(event)
        }
        setSelectedLink(ref as RefObject<HTMLElement>)
        event.preventDefault()
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
        event.preventDefault()
      },
      [onSelect, afterSelect, ref, setSelectedLink]
    )
    return (
      <Box as="li" sx={listItemStyles}>
        <Box
          as={Component}
          href={href}
          onKeyPress={keyPressHandler}
          onClick={clickHandler}
          {...(selectedLink === ref ? {'aria-current': 'page'} : {})}
          sx={merge(linkStyles, sxProp as SxProp)}
          {...props}
          ref={ref}
        >
          {LeadingIcon && (
            <Box as="span" data-component="leadingIcon" sx={iconWrapStyles}>
              <LeadingIcon />
            </Box>
          )}

          {children && (
            <Box as="span" data-component="text" sx={textStyles}>
              {children}
            </Box>
          )}
          {counter && (
            <Box as="span" data-component="counter" sx={counterStyles}>
              <CounterLabel>{counter}</CounterLabel>
            </Box>
          )}
        </Box>
      </Box>
    )
  }
) as PolymorphicForwardRefComponent<'a', UnderlineNavLinkProps>
