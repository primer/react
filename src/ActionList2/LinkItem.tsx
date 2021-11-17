import React from 'react'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '@radix-ui/react-polymorphic'
import Link from '../Link'
import {SxProp, merge} from '../sx'
import {Item, ItemProps} from './Item'

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

// LinkItem does not support selected, variants, etc.
type LinkItemProps = Pick<ItemProps, 'children' | 'sx'> & LinkProps

export const LinkItem = React.forwardRef(({sx = {}, as: Component, ...props}, forwardedRef) => {
  const styles = {
    // occupy full size of Item
    paddingX: 2,
    paddingY: '6px', // custom value off the scale
    display: 'flex',
    flexGrow: 1, // full width
    borderRadius: 2,

    // inherit Item styles
    color: 'inherit',
    '&:hover': {color: 'inherit', textDecoration: 'none'}
  }

  return (
    <Item
      sx={{paddingY: 0, paddingX: 0}}
      _PrivateItemWrapper={({children}) => (
        <Link as={Component} sx={merge(styles, sx as SxProp)} {...props} ref={forwardedRef}>
          {children}
        </Link>
      )}
    >
      {props.children}
    </Item>
  )
}) as PolymorphicForwardRefComponent<'a', LinkItemProps>
