import {NavList as PrimerNavList, Box} from '@primer/react'
import type {
  NavListProps as PrimerNavListProps,
  NavListItemProps as PrimerNavListItemProps,
  NavListSubNavProps as PrimerNavListSubNavProps,
  NavListDividerProps as PrimerNavListDividerProps,
  NavListGroupProps as PrimerNavListGroupProps,
  SxProp,
} from '@primer/react'
import {forwardRef, type ComponentProps, type PropsWithChildren} from 'react'

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

const NavList = Object.assign(NavListImpl, {
  // Wrapped components that need sx support added back in
  Item: NavListItem,
  SubNav: NavListSubNav,
  Divider: NavListDivider,
  Group: NavListGroup,

  // Re-exporting others directly
  // TODO: try to remove typecasts to work around "non-portable types" TS error
  LeadingVisual: PrimerNavList.LeadingVisual as React.FC<
    React.PropsWithChildren<ComponentProps<typeof PrimerNavList.LeadingVisual> & SxProp>
  >,
  TrailingVisual: PrimerNavList.TrailingVisual as React.FC<
    React.PropsWithChildren<ComponentProps<typeof PrimerNavList.TrailingVisual> & SxProp>
  >,
  TrailingAction: PrimerNavList.TrailingAction as React.FC<
    React.PropsWithChildren<ComponentProps<typeof PrimerNavList.TrailingAction> & SxProp>
  >,
  GroupHeading: PrimerNavList.GroupHeading as React.FC<
    React.PropsWithChildren<ComponentProps<typeof PrimerNavList.GroupHeading> & SxProp>
  >,
  GroupExpand: PrimerNavList.GroupExpand as React.FC<
    React.PropsWithChildren<ComponentProps<typeof PrimerNavList.GroupExpand> & SxProp>
  >,
})

export {NavList}
export type {NavListProps}
