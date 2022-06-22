import React, {forwardRef, useLayoutEffect, createRef, useContext} from 'react'
import Box from '../Box'
import {merge, SxProp} from '../sx'
import {get} from '../constants'
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
    {sx: sxProp = {}, as: Component = 'a', href = '#', children, selected = false, leadingIcon: LeadingIcon, ...props},
    forwardedRef
  ) => {
    const ref = forwardedRef ?? createRef()
    const underlineNavContext = useContext(UnderlineNavContext)
    useLayoutEffect(() => {
      const domRect = ref?.current.getBoundingClientRect()
      underlineNavContext.setChildrenWidth({width: domRect.width})
    }, [ref.current])
    const iconWrapStyles = {
      display: 'inline-block',
      marginRight: '8px'
    }

    const linkStyles = {
      display: 'inline-flex',
      color: 'fg.default',
      textAlign: 'center',
      borderBottom: '2px solid transparent',
      borderColor: selected ? 'primer.border.active' : 'transparent',
      textDecoration: 'none',
      paddingX: get('space.2'),
      paddingY: get('space.3'),
      marginRight: get('space.3'),
      fontSize: get('fontSizes.1'),
      '&:hover, &:focus': {
        borderColor: 'neutral.muted',
        transition: '0.2s ease'
      }
    }
    return (
      <Box as="li">
        <Box
          as={Component}
          href={href}
          selected={selected}
          {...(selected ? {'aria-current': 'page'} : {})}
          sx={merge(linkStyles, sxProp as SxProp)}
          {...props}
          ref={ref}
        >
          {LeadingIcon && (
            <Box as="span" data-component="leadingIcon" sx={iconWrapStyles}>
              <LeadingIcon />
            </Box>
          )}
          {children && <span data-component="text">{children}</span>}
        </Box>
      </Box>
    )
  }
) as PolymorphicForwardRefComponent<'a', UnderlineNavLinkProps>
