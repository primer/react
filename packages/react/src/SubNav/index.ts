import {SubNav as SubNavImpl, SubNavLink, SubNavLinks} from './SubNav'
import type {SubNavProps, SubNavLinkProps, SubNavLinksProps} from './SubNav'

SubNavLink.displayName = 'SubNav.Link'
SubNavLinks.displayName = 'SubNav.Links'

export const SubNav = Object.assign(SubNavImpl, {Link: SubNavLink, Links: SubNavLinks})

export type {SubNavProps, SubNavLinkProps, SubNavLinksProps}
