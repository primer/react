import React from 'react'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import Link from '../Link'
import {Item} from './Item'
import type {ActionListItemProps} from './shared'

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
  className?: string
}

// LinkItem does not support selected, loading, variants, etc.
export type ActionListLinkItemProps = Pick<
  ActionListItemProps,
  'active' | 'children' | 'sx' | 'inactiveText' | 'variant'
> &
  LinkProps

export const LinkItem = React.forwardRef(
  ({sx, active, inactiveText, variant, as: Component, className, ...props}, forwardedRef) => {
    return (
      <Item
        className={className}
        active={active}
        inactiveText={inactiveText}
        data-inactive={inactiveText ? true : undefined}
        variant={variant}
        sx={sx}
        _PrivateItemWrapper={({children, onClick, ...rest}) => {
          const clickHandler = (event: React.MouseEvent<HTMLElement>) => {
            onClick && onClick(event)
            props.onClick && props.onClick(event as React.MouseEvent<HTMLAnchorElement>)
          }
          return inactiveText ? (
            <span {...rest}>{children}</span>
          ) : (
            <Link as={Component} {...rest} {...props} onClick={clickHandler} ref={forwardedRef}>
              {children}
            </Link>
          )
        }}
      >
        {props.children}
      </Item>
    )
  },
) as PolymorphicForwardRefComponent<'a', ActionListLinkItemProps>

LinkItem.displayName = 'ActionList.LinkItem'
