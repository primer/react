import {UnderlineNav as UnderlineNavImpl, UnderlineNavLink} from './UnderlineNav'
import type {UnderlineNavProps, UnderlineNavLinkProps} from './UnderlineNav'

export const UnderlineNav = Object.assign(UnderlineNavImpl, {Link: UnderlineNavLink})

export type {UnderlineNavProps, UnderlineNavLinkProps}
