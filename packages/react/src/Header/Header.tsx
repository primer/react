import type {Location, Pathname} from 'history'
import React from 'react'
import {clsx} from 'clsx'
import classes from './Header.module.css'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'

export type HeaderProps = React.ComponentProps<'header'> & {as?: React.ElementType}
export type HeaderItemProps = React.ComponentProps<'div'> & {full?: boolean}
export type HeaderLinkProps = React.ComponentProps<'a'> & {to?: Location | Pathname; as?: React.ElementType}

const Header = React.forwardRef<HTMLElement, HeaderProps>(function Header(
  {as: BaseComponent = 'header', children, className, ...rest},
  forwardRef,
) {
  return (
    <BaseComponent ref={forwardRef} className={clsx(className, classes.Header)} {...rest}>
      {children}
    </BaseComponent>
  )
}) as PolymorphicForwardRefComponent<'header', HeaderProps>

Header.displayName = 'Header'

const HeaderItem = React.forwardRef<HTMLDivElement, HeaderItemProps>(function HeaderItem(
  {children, className, full, ...rest},
  forwardRef,
) {
  return (
    <div ref={forwardRef} className={clsx(className, classes.HeaderItem)} data-full={full} {...rest}>
      {children}
    </div>
  )
})

HeaderItem.displayName = 'Header.Item'

const HeaderLink = React.forwardRef<HTMLAnchorElement, HeaderLinkProps>(function HeaderLink(
  {children, className, as: BaseComponent = 'a', ...rest},
  forwardRef,
) {
  return (
    <BaseComponent ref={forwardRef} className={clsx(className, classes.HeaderLink)} {...rest}>
      {children}
    </BaseComponent>
  )
})

HeaderLink.displayName = 'Header.Link'

export default Object.assign(Header, {Link: HeaderLink, Item: HeaderItem})

Header.__SLOT__ = Symbol('Header')
// @ts-ignore -- TS doesn't know about the __SLOT__ property
HeaderItem.__SLOT__ = Symbol('Header.Item')
// @ts-ignore -- TS doesn't know about the __SLOT__ property
HeaderLink.__SLOT__ = Symbol('Header.Link')
