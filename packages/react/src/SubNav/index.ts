import {SubNav as SubNavImpl, SubNavLink, SubNavLinks} from './SubNav'
import type {SubNavProps, SubNavLinkProps, SubNavLinksProps} from './SubNav'

export const SubNav = Object.assign(SubNavImpl, {Link: SubNavLink, Links: SubNavLinks})

export type {SubNavProps, SubNavLinkProps, SubNavLinksProps}
