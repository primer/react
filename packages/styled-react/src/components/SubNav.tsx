import {
  SubNav as PrimerSubNav,
  type SubNavProps as PrimerSubNavProps,
  type SubNavLinkProps as PrimerSubNavLinkProps,
} from '@primer/react'
import {forwardRef} from 'react'
import {Box} from './Box'
import type {SxProp} from '../sx'

type SubNavProps = PrimerSubNavProps & SxProp

const SubNavImpl = forwardRef<HTMLElement, SubNavProps>(function SubNav(props, ref) {
  return <Box as={PrimerSubNav} ref={ref} {...props} />
})

type SubNavLinkProps = PrimerSubNavLinkProps & SxProp

const SubNavLink = forwardRef<HTMLAnchorElement, SubNavLinkProps>(function SubNavLink(props, ref) {
  return <Box as={PrimerSubNav.Link} ref={ref} {...props} />
})

const SubNav = Object.assign(SubNavImpl, {
  Link: SubNavLink,
})

// @ts-ignore - TypeScript doesn't know about the __SLOT__ prop
SubNav.__SLOT__ = Symbol('SubNav')
// @ts-ignore - TypeScript doesn't know about the __SLOT__ prop
SubNavLink.__SLOT__ = Symbol('SubNavLink')

export {SubNav, type SubNavProps, type SubNavLinkProps}
