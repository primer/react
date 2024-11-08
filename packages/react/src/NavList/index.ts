import {
  Root as NavListImpl,
  Item,
  SubNav,
  LeadingVisual,
  TrailingVisual,
  TrailingAction,
  Divider,
  Group,
  GroupHeading,
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
  NavListGroupHeadingProps,
} from './NavList'

export const NavList = Object.assign(NavListImpl, {
  Item,
  SubNav,
  LeadingVisual,
  TrailingVisual,
  TrailingAction,
  Divider,
  Group,
  GroupHeading,
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
  NavListGroupHeadingProps,
}
