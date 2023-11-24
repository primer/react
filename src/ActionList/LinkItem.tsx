import React from 'react'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import Link from '../Link'
import {BetterSystemStyleObject, SxProp, merge} from '../sx'
import {Item} from './Item'
import {ActionListItemProps} from './shared'

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
export type ActionListLinkItemProps = Pick<ActionListItemProps, 'active' | 'children' | 'sx'> & LinkProps

export const LinkItem = React.forwardRef(({sx = {}, active, as: Component, ...props}, forwardedRef) => {
  return (
    <Item
      active={active}
      sx={{paddingY: 0, paddingX: 0}}
      _PrivateItemWrapper={({children, styles, onClick, ...rest}) => {
        const clickHandler = (event: React.MouseEvent) => {
          onClick && onClick(event)
          props.onClick && props.onClick(event as React.MouseEvent<HTMLAnchorElement>)
        }
        return (
          <Link
            as={Component}
            sx={merge<BetterSystemStyleObject>(
              {
                ...styles, // shared style from Item
                flexGrow: 1, // full width
                color: 'inherit',
                '&:hover': {color: 'inherit', textDecoration: 'none'},
              },
              sx as SxProp,
            )}
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
