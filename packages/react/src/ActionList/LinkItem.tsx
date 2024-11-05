import React from 'react'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import Link from '../Link'
import type {SxProp} from '../sx'
import {merge} from '../sx'
import {Item} from './Item'
import type {ActionListItemProps} from './shared'
import Box from '../Box'

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

// LinkItem does not support selected, loading, variants, etc.
export type ActionListLinkItemProps = Pick<ActionListItemProps, 'active' | 'children' | 'sx' | 'inactiveText'> &
  LinkProps

export const LinkItem = React.forwardRef(({sx = {}, active, inactiveText, as: Component, ...props}, forwardedRef) => {
  const styles = {
    // occupy full size of Item
    paddingX: 2,
    paddingY: '6px', // custom value off the scale
    display: 'flex',
    flexGrow: 1, // full width
    borderRadius: 2,

    // inherit Item styles
    color: 'inherit',
    '&:hover': {color: 'inherit', textDecoration: 'none'},
  }

  return (
    <Item
      active={active}
      sx={{paddingY: 0, paddingX: 0}}
      inactiveText={inactiveText}
      data-inactive={inactiveText ? true : undefined}
      _PrivateItemWrapper={({children, onClick, ...rest}) => {
        const clickHandler = (event: React.MouseEvent<HTMLElement>) => {
          onClick && onClick(event)
          props.onClick && props.onClick(event as React.MouseEvent<HTMLAnchorElement>)
        }
        return inactiveText ? (
          <Box sx={merge(styles, sx as SxProp)} {...rest}>
            {children}
          </Box>
        ) : (
          <Link
            as={Component}
            sx={merge(styles, sx as SxProp)}
            {...rest}
            {...props}
            onClick={clickHandler}
            ref={forwardedRef}
          >
            {children}
          </Link>
        )
      }}
    >
      {props.children}
    </Item>
  )
}) as PolymorphicForwardRefComponent<'a', ActionListLinkItemProps>
