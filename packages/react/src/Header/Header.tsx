import type {Location, Pathname} from 'history'
import type {SxProp} from '../sx'
import React from 'react'
import {clsx} from 'clsx'
import classes from './Header.module.css'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {BoxWithFallback} from '../internal/components/BoxWithFallback'

export type HeaderProps = React.ComponentProps<'header'> & SxProp & {as?: React.ElementType}
export type HeaderItemProps = React.ComponentProps<'div'> & SxProp & {full?: boolean}
export type HeaderLinkProps = React.ComponentProps<'a'> & SxProp & {to?: Location | Pathname; as?: React.ElementType}

const Header = React.forwardRef<HTMLElement, HeaderProps>(function Header(
  {children, className, as = 'header', ...rest},
  forwardRef,
) {
  return (
    <BoxWithFallback as={as} ref={forwardRef} className={clsx(className, classes.Header)} {...rest}>
      {children}
    </BoxWithFallback>
  )
}) as PolymorphicForwardRefComponent<'header', HeaderProps>

Header.displayName = 'Header'

const HeaderItem = React.forwardRef<HTMLDivElement, HeaderItemProps>(function HeaderItem(
  {children, className, full, ...rest},
  forwardRef,
) {
  return (
    <BoxWithFallback ref={forwardRef} className={clsx(className, classes.HeaderItem)} data-full={full} {...rest}>
      {children}
    </BoxWithFallback>
  )
})

HeaderItem.displayName = 'Header.Item'

const HeaderLink = React.forwardRef<HTMLAnchorElement, HeaderLinkProps>(function HeaderLink(
  {children, className, as = 'a', ...rest},
  forwardRef,
) {
  return (
    <BoxWithFallback as={as} ref={forwardRef} className={clsx(className, classes.HeaderLink)} {...rest}>
      {children}
    </BoxWithFallback>
  )
})

HeaderLink.displayName = 'Header.Link'

export default Object.assign(Header, {Link: HeaderLink, Item: HeaderItem})
