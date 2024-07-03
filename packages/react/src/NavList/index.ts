import {
  NavList as NavListImpl,
  Item,
  SubNav,
  LeadingVisual,
  TrailingVisual,
  TrailingAction,
  Divider,
  Group,
} from './NavList'
import type {
  NavListProps,
  NavListItemProps,
  NavListSubNavProps,
  NavListLeadingVisualProps,
  NavListTrailingVisualProps,
  NavListTrailingActionProps,
  NavListDividerProps,
  NavListGroupProps,
} from './NavList'

Item.displayName = 'NavList.Item'
SubNav.displayName = 'NavList.SubNav'
LeadingVisual.displayName = 'NavList.LeadingVisual'
TrailingVisual.displayName = 'NavList.TrailingVisual'
TrailingAction.displayName = 'NavList.TrailingAction'
Divider.displayName = 'NavList.Divider'
Group.displayName = 'NavList.Group'

export const NavList = Object.assign(NavListImpl, {
  Item,
  SubNav,
  LeadingVisual,
  TrailingVisual,
  TrailingAction,
  Divider,
  Group,
})

export type {
  NavListProps,
  NavListItemProps,
  NavListSubNavProps,
  NavListLeadingVisualProps,
  NavListTrailingVisualProps,
  NavListTrailingActionProps,
  NavListDividerProps,
  NavListGroupProps,
}
