import {
  Root as NavListImpl,
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
