import type {UnderlineNavProps} from './UnderlineNav'
import {UnderlineNav as Nav} from './UnderlineNav'
import type {UnderlineNavItemProps} from './UnderlineNavItem'
import {UnderlineNavItem} from './UnderlineNavItem'

const UnderlineNav = Object.assign(Nav, {
  Item: UnderlineNavItem,
})

export {UnderlineNav}
export type {UnderlineNavProps, UnderlineNavItemProps}
