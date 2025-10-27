import {
  type HeaderProps as PrimerHeaderProps,
  type HeaderItemProps as PrimerHeaderItemProps,
  type HeaderLinkProps as PrimerHeaderLinkProps,
  Header as PrimerHeader,
  type HeaderLinkProps,
} from '@primer/react'
import {forwardRef} from 'react'
import {Box} from './Box'
import type {ForwardRefComponent} from '../polymorphic'
import type {SxProp} from '../sx'

type HeaderProps = PrimerHeaderProps & SxProp

const StyledHeader = forwardRef(function Header(props, ref) {
  return <Box as={PrimerHeader} ref={ref} {...props} />
}) as ForwardRefComponent<'header', HeaderProps>

const HeaderImpl = forwardRef(({as, ...props}: HeaderProps, ref) => (
  <StyledHeader {...props} {...(as ? {forwardedAs: as} : {})} ref={ref} />
)) as ForwardRefComponent<'header', HeaderProps>

type HeaderItemProps = PrimerHeaderItemProps & SxProp

const HeaderItem = forwardRef<HTMLDivElement, HeaderItemProps>(function HeaderItem(props, ref) {
  return <Box as={PrimerHeader.Item} ref={ref} {...props} />
})

const StyledHeaderLink = forwardRef<HTMLAnchorElement, PrimerHeaderLinkProps>(function HeaderLink(props, ref) {
  return <Box as={PrimerHeader.Link} ref={ref} {...props} />
})

const HeaderLink = forwardRef<HTMLAnchorElement, HeaderLinkProps>(({as, ...props}, ref) => (
  <StyledHeaderLink {...props} {...(as ? {forwardedAs: as} : {})} ref={ref} />
))

const Header = Object.assign(HeaderImpl, {
  Item: HeaderItem,
  Link: HeaderLink,
})

export {Header, type HeaderProps}
