import React, {forwardRef, useLayoutEffect, useRef, useContext, MutableRefObject, RefObject} from 'react'
import Box from '../Box'
import {merge, SxProp, BetterSystemStyleObject} from '../sx'
import {IconProps} from '@primer/octicons-react'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '@radix-ui/react-polymorphic'
import {UnderlineNavContext} from './UnderlineNavContext'

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
} & SxProp &
  LinkProps

export const UnderlineNavLink = forwardRef(
  (
    {
      sx: sxProp = {},
      as: Component = 'a',
      href = '#',
      children,
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
    const smallVariantLinkStyles = {
      paddingY: 2,
      fontSize: 0
    }
    const defaultVariantLinkStyles = {
      paddingY: 3,
      fontSize: 1
    }

    const linkStyles = {
      display: 'inline-flex',
      color: 'fg.default',
      textAlign: 'center',
      borderBottom: '2px solid transparent',
      borderColor: selectedLink === ref ? 'primer.border.active' : 'transparent',
      textDecoration: 'none',
      paddingX: 2,
      marginRight: 3,
      ...(variant === 'small' ? smallVariantLinkStyles : defaultVariantLinkStyles),
      '&:hover, &:focus': {
        borderColor: selectedLink === ref ? 'primer.border.active' : 'neutral.muted',
        transition: '0.2s ease'
      }
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
      <Box as="li">
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
        </Box>
      </Box>
    )
  }
) as PolymorphicForwardRefComponent<'a', UnderlineNavLinkProps>
