import type {UnderlineNavProps} from './UnderlineNav'
import {UnderlineNav as Nav} from './UnderlineNav'
import type {UnderlineNavItemProps} from './UnderlineNavItem'
import {UnderlineNavItem} from './UnderlineNavItem'

export const UnderlineNav = Object.assign(Nav, {
  Item: UnderlineNavItem,
})

export type {UnderlineNavProps, UnderlineNavItemProps}
