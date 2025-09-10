import {NavList as PrimerNavList, Box} from '@primer/react'
import type {
  NavListProps as PrimerNavListProps,
  NavListItemProps as PrimerNavListItemProps,
  NavListSubNavProps as PrimerNavListSubNavProps,
  NavListDividerProps as PrimerNavListDividerProps,
  NavListGroupProps as PrimerNavListGroupProps,
  NavListGroupHeadingProps as PrimerNavListGroupHeadingProps,
  SxProp,
} from '@primer/react'
import {forwardRef, type PropsWithChildren} from 'react'

type NavListProps = PropsWithChildren<PrimerNavListProps> & SxProp

const NavListImpl = forwardRef<HTMLElement, NavListProps>(function NavList(props, ref) {
  return <Box as={PrimerNavList} ref={ref} {...props} />
})

type NavListItemProps = PropsWithChildren<PrimerNavListItemProps> & SxProp

const NavListItem = forwardRef<HTMLAnchorElement, NavListItemProps>(function NavListItem(props, ref) {
  // @ts-expect-error - PrimerNavList.Item is not recognized as a valid component type
  return <Box as={PrimerNavList.Item} ref={ref} {...props} />
})

type NavListSubNavProps = PropsWithChildren<PrimerNavListSubNavProps> & SxProp

const NavListSubNav = forwardRef<HTMLUListElement, NavListSubNavProps>(function NavListSubNav(props, ref) {
  // @ts-expect-error - PrimerNavList.SubNav is not recognized as a valid component type
  return <Box as={PrimerNavList.SubNav} ref={ref} {...props} />
})

type NavListDividerProps = PropsWithChildren<PrimerNavListDividerProps> & SxProp

const NavListDivider = forwardRef<HTMLLIElement, NavListDividerProps>(function NavListDivider(props, ref) {
  // @ts-expect-error - PrimerNavList.Divider is not recognized as a valid component type
  return <Box as={PrimerNavList.Divider} ref={ref} {...props} />
})

type NavListGroupProps = PropsWithChildren<PrimerNavListGroupProps> & SxProp

const NavListGroup = forwardRef<HTMLLIElement, NavListGroupProps>(function NavListGroup(props, ref) {
  // @ts-expect-error - PrimerNavList.Group is not recognized as a valid component type
  return <Box as={PrimerNavList.Group} ref={ref} {...props} />
})

type NavListGroupHeadingProps = PropsWithChildren<PrimerNavListGroupHeadingProps> & SxProp

// TODO: figure out how to handle `NavList.GroupHeading`'s `as` prop
const NavListGroupHeading = forwardRef<HTMLDivElement, NavListGroupHeadingProps>(
  function NavListGroupHeading(props, ref) {
    return <Box as={PrimerNavList.GroupHeading} ref={ref} {...props} />
  },
)

// TODO: figure out why we need a type assertion here and try to remove it
const NavList = Object.assign(NavListImpl, {
  // Wrapped components that need sx support added back in
  Item: NavListItem,
  SubNav: NavListSubNav,
  Divider: NavListDivider,
  Group: NavListGroup,
  GroupHeading: NavListGroupHeading,

  // Re-exporting others directly
  LeadingVisual: PrimerNavList.LeadingVisual,
  TrailingVisual: PrimerNavList.TrailingVisual,
  TrailingAction: PrimerNavList.TrailingAction,
  GroupExpand: PrimerNavList.GroupExpand,
})

export {NavList}
export type {NavListProps}
