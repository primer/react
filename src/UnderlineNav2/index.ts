import {UnderlineNav as Nav, UnderlineNavProps} from './UnderlineNav'
import {UnderlineNavLink, UnderlineNavLinkProps} from './UnderlineNavLink'

const UnderlineNav = Object.assign(Nav, {
  Link: UnderlineNavLink
})

export default UnderlineNav

export type {UnderlineNavProps, UnderlineNavLinkProps}
