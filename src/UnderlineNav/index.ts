import {UnderlineNav as Nav, UnderlineNavProps} from './UnderlineNav'
import {UnderlineNavLink, UnderlineNavLinkProps} from './UnderlineNavLink'

export const UnderlineNav = Object.assign(Nav, {
  Link: UnderlineNavLink
})

export type {UnderlineNavProps, UnderlineNavLinkProps}
