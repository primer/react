import {
  SubNav as PrimerSubNav,
  type SubNavProps as PrimerSubNavProps,
  type SubNavLinkProps as PrimerSubNavLinkProps,
  type SlotMarker,
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
  __SLOT__: PrimerSubNav.__SLOT__,
  Link: SubNavLink,
})

;(SubNavLink as typeof SubNavLink & SlotMarker).__SLOT__ = PrimerSubNav.Link.__SLOT__

export {SubNav, type SubNavProps, type SubNavLinkProps}
