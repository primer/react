import type {Location, Pathname} from 'history'
import type {SxProp} from '../sx'
import type {ComponentProps} from '../utils/types'
import React from 'react'
import {clsx} from 'clsx'
import classes from './Header.module.css'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {defaultSxProp} from '../utils/defaultSxProp'
import Box from '../Box'

type StyledHeaderProps = React.ComponentProps<'header'> & SxProp
type StyledHeaderItemProps = React.ComponentProps<'div'> & SxProp & {full?: boolean}
type StyledHeaderLinkProps = React.ComponentProps<'a'> & SxProp & {to?: Location | Pathname}

const Header = React.forwardRef<HTMLElement, StyledHeaderProps>(function Header(
  {children, className, sx: sxProp = defaultSxProp, ...rest},
  forwardRef,
) {
  if (sxProp !== defaultSxProp) {
    return (
      <Box as={'header'} sx={sxProp} ref={forwardRef} className={clsx(className, classes.Header)} {...rest}>
        {children}
      </Box>
    )
  }
  return (
    <header ref={forwardRef} className={clsx(className, classes.Header)} {...rest}>
      {children}
    </header>
  )
}) as PolymorphicForwardRefComponent<'header', StyledHeaderProps>

Header.displayName = 'Header'

const HeaderItem = React.forwardRef<HTMLDivElement, StyledHeaderItemProps>(function HeaderItem(
  {children, className, sx: sxProp = defaultSxProp, ...rest},
  forwardRef,
) {
  if (sxProp !== defaultSxProp) {
    return (
      <Box
        as={'div'}
        sx={sxProp}
        ref={forwardRef}
        className={clsx(className, classes.HeaderItem)}
        data-full={rest.full}
        {...rest}
      >
        {children}
      </Box>
    )
  }
  return (
    <div ref={forwardRef} className={clsx(className, classes.HeaderItem)} data-full={rest.full} {...rest}>
      {children}
    </div>
  )
})

HeaderItem.displayName = 'Header.Item'

const HeaderLink = React.forwardRef<HTMLAnchorElement, StyledHeaderLinkProps>(function HeaderLink(
  {children, className, sx: sxProp = defaultSxProp, ...rest},
  forwardRef,
) {
  if (sxProp !== defaultSxProp) {
    return (
      <Box as={'a'} sx={sxProp} ref={forwardRef} className={clsx(className, classes.HeaderLink)} {...rest}>
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

export type HeaderProps = ComponentProps<typeof Header>
export type HeaderLinkProps = ComponentProps<typeof HeaderLink>
export type HeaderItemProps = ComponentProps<typeof HeaderItem>
export default Object.assign(Header, {Link: HeaderLink, Item: HeaderItem})
