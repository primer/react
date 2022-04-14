import {UnderlineNav as Nav, UnderlineNavProps} from './UnderlineNav'
import {UnderlineNavLink, UnderlineNavLinkProps} from './UnderlineNavLink'
import {UnderlineNavActions, UnderlineNavActionsProps} from './UnderlineNavActions'

const UnderlineNav = Object.assign(Nav, {
  Link: UnderlineNavLink,
  Actions: UnderlineNavActions
})

export default UnderlineNav

export type {UnderlineNavProps, UnderlineNavLinkProps, UnderlineNavActionsProps}
