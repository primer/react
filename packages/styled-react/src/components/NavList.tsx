import {NavList as PrimerNavList, Box} from '@primer/react'
import type {
  NavListProps as PrimerNavListProps,
  NavListItemProps as PrimerNavListItemProps,
  NavListGroupProps as PrimerNavListGroupProps,
} from '@primer/react'
import {forwardRef, type ComponentProps, type PropsWithChildren} from 'react'
import {type SxProp} from '../sx'

type NavListProps = PropsWithChildren<PrimerNavListProps> & SxProp

const NavListImpl = forwardRef<HTMLElement, NavListProps>(function NavList(props, ref) {
  return <Box as={PrimerNavList} ref={ref} {...props} />
})

type NavListItemProps = PropsWithChildren<PrimerNavListItemProps> & SxProp

const NavListItem = forwardRef<HTMLAnchorElement, NavListItemProps>(function NavListItem(props, ref) {
  // @ts-expect-error - PrimerNavList.Item is not recognized as a valid component type
  return <Box as={PrimerNavList.Item} ref={ref} {...props} />
})

type NavListGroupProps = PropsWithChildren<PrimerNavListGroupProps> & SxProp

const NavListGroup = forwardRef<HTMLLIElement, NavListGroupProps>(function NavListGroup(props, ref) {
  // @ts-expect-error - PrimerNavList.Group is not recognized as a valid component type
  return <Box as={PrimerNavList.Group} ref={ref} {...props} />
})

const NavList = Object.assign(NavListImpl, {
  // Wrapped components that need sx support added back in
  Item: NavListItem,
  Group: NavListGroup,

  // Re-exporting others directly
  // TODO: try to remove typecasts to work around "non-portable types" TS error
  SubNav: PrimerNavList.SubNav as React.FC<React.PropsWithChildren<ComponentProps<typeof PrimerNavList.SubNav>>>,
  Divider: PrimerNavList.Divider as React.FC<React.PropsWithChildren<ComponentProps<typeof PrimerNavList.Divider>>>,
  LeadingVisual: PrimerNavList.LeadingVisual as React.FC<
    React.PropsWithChildren<ComponentProps<typeof PrimerNavList.LeadingVisual>>
  >,
  TrailingVisual: PrimerNavList.TrailingVisual as React.FC<
    React.PropsWithChildren<ComponentProps<typeof PrimerNavList.TrailingVisual>>
  >,
  TrailingAction: PrimerNavList.TrailingAction as React.FC<
    React.PropsWithChildren<ComponentProps<typeof PrimerNavList.TrailingAction>>
  >,
  GroupHeading: PrimerNavList.GroupHeading as React.FC<
    React.PropsWithChildren<ComponentProps<typeof PrimerNavList.GroupHeading>>
  >,
  GroupExpand: PrimerNavList.GroupExpand as React.FC<
    React.PropsWithChildren<ComponentProps<typeof PrimerNavList.GroupExpand>>
  >,
})

export {NavList, type NavListProps}
