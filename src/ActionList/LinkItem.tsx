import React from 'react'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import Link from '../Link'
import {SxProp, merge} from '../sx'
import {Item} from './Item'
import {ActionListItemProps} from './shared'

// adopted from React.AnchorHTMLAttributes
type LinkProps = {
  download?: string
  href?: string
  to?: string
  hrefLang?: string
  media?: string
  ping?: string
  rel?: string
  target?: string
  type?: string
  referrerPolicy?: React.AnchorHTMLAttributes<HTMLAnchorElement>['referrerPolicy']
}

// LinkItem does not support selected, variants, etc.
export type ActionListLinkItemProps = Pick<ActionListItemProps, 'active' | 'children' | 'sx'> & LinkProps

export const LinkItem = React.forwardRef(({sx = {}, active, ...props}, forwardedRef) => {
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

  if (props.href === undefined && props.to !== undefined) props.href = props.to

  return (
    <Item
      active={active}
      sx={{paddingY: 0, paddingX: 0}}
      _PrivateItemWrapper={({children, onClick, ...rest}) => {
        const clickHandler = (event: React.MouseEvent) => {
          onClick && onClick(event)
          props.onClick && props.onClick(event as React.MouseEvent<HTMLAnchorElement>)
        }
        return (
          <Link sx={merge(styles, sx as SxProp)} {...rest} {...props} onClick={clickHandler} ref={forwardedRef}>
            {children}
          </Link>
        )
      }}
    >
      {props.children}
    </Item>
  )
}) as PolymorphicForwardRefComponent<'a', ActionListLinkItemProps>
