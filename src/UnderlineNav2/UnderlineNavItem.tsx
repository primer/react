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
  leadingIcon?: React.FunctionComponent<IconProps>
  as?: React.ElementType
  /**
   * Counter
   */
  counter?: number
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

    const wrapperStyles = {
      display: 'inline-flex',
      paddingY: 1,
      paddingX: 2,
      borderRadius: 2
    }
    const smallVariantLinkStyles = {
      paddingY: 1,
      fontSize: 0
    }
    const defaultVariantLinkStyles = {
      paddingY: 2,
      fontSize: 1
    }

    const linkStyles = {
      display: 'inline-flex',
      color: 'fg.default',
      textAlign: 'center',
      textDecoration: 'none',
      paddingX: 1,
      marginRight: 3,
      ...(variant === 'small' ? smallVariantLinkStyles : defaultVariantLinkStyles),
      '&:hover > div[data-component="wrapper"] ': {
        backgroundColor: 'neutral.muted'
      },
      '&:focus': {
        outlineColor: 'accent.fg',
        borderRadius: '12px',
        outlineOffset: '-6px',
        transition: '0.2s ease'
      }
    }

    const borderStyles = {
      // How to use primer primitives for space 3?
      width: `calc(100% - 16px)`,
      height: 2,
      backgroundColor: 'primer.border.active'
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
      <Box as="li" sx={{display: 'grid'}}>
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
          <Box as="div" data-component="wrapper" sx={wrapperStyles}>
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
        {selectedLink === ref && <Box as="span" sx={borderStyles}></Box>}
      </Box>
    )
  }
) as PolymorphicForwardRefComponent<'a', UnderlineNavItemProps>
