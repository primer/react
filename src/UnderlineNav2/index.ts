import {UnderlineNav as Nav, UnderlineNavProps} from './UnderlineNav'
import {UnderlineNavItem, UnderlineNavItemProps} from './UnderlineNavItem'

const UnderlineNav = Object.assign(Nav, {
  Item: UnderlineNavItem
})

export {UnderlineNav}

export type {UnderlineNavProps, UnderlineNavItemProps}
