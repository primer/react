import type {Location, Pathname} from 'history'
import type {SxProp} from '../sx'
import React from 'react'
import {clsx} from 'clsx'
import classes from './Header.module.css'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {defaultSxProp} from '../utils/defaultSxProp'
import Box from '../Box'

export type HeaderProps = React.ComponentProps<'header'> & SxProp & {as?: React.ElementType}
export type HeaderItemProps = React.ComponentProps<'div'> & SxProp & {full?: boolean}
export type HeaderLinkProps = React.ComponentProps<'a'> & SxProp & {to?: Location | Pathname; as?: React.ElementType}

const Header = React.forwardRef<HTMLElement, HeaderProps>(function Header(
  {children, className, sx: sxProp = defaultSxProp, as = 'header', ...rest},
  forwardRef,
) {
  if (sxProp !== defaultSxProp || as !== 'header') {
    return (
      <Box as={as} sx={sxProp} ref={forwardRef} className={clsx(className, classes.Header)} {...rest}>
        {children}
      </Box>
    )
  }
  return (
    <header ref={forwardRef} className={clsx(className, classes.Header)} {...rest}>
      {children}
    </header>
  )
}) as PolymorphicForwardRefComponent<'header', HeaderProps>

Header.displayName = 'Header'

const HeaderItem = React.forwardRef<HTMLDivElement, HeaderItemProps>(function HeaderItem(
  {children, className, sx: sxProp = defaultSxProp, full, ...rest},
  forwardRef,
) {
  if (sxProp !== defaultSxProp) {
    return (
      <Box
        as={'div'}
        sx={sxProp}
        ref={forwardRef}
        className={clsx(className, classes.HeaderItem)}
        data-full={full}
        {...rest}
      >
        {children}
      </Box>
    )
  }
  return (
    <div ref={forwardRef} className={clsx(className, classes.HeaderItem)} data-full={full} {...rest}>
      {children}
    </div>
  )
})

HeaderItem.displayName = 'Header.Item'

const HeaderLink = React.forwardRef<HTMLAnchorElement, HeaderLinkProps>(function HeaderLink(
  {children, className, sx: sxProp = defaultSxProp, as = 'a', ...rest},
  forwardRef,
) {
  if (sxProp !== defaultSxProp || as !== 'a') {
    return (
      <Box as={as} sx={sxProp} ref={forwardRef} className={clsx(className, classes.HeaderLink)} {...rest}>
        {children}
      </Box>
    )
  }
  return (
    <a ref={forwardRef} className={clsx(className, classes.HeaderLink)} {...rest}>
      {children}
    </a>
  )
})

HeaderLink.displayName = 'Header.Link'

export default Object.assign(Header, {Link: HeaderLink, Item: HeaderItem})
