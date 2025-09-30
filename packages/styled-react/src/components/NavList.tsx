import {NavList as PrimerNavList, Box} from '@primer/react'
import type {
  NavListProps as PrimerNavListProps,
  NavListItemProps as PrimerNavListItemProps,
  NavListGroupProps as PrimerNavListGroupProps,
  NavListGroupHeadingProps as PrimerNavListGroupHeadingProps,
  NavListLeadingVisualProps as PrimerNavListLeadingVisualProps,
  NavListTrailingVisualProps as PrimerNavListTrailingVisualProps,
  NavListTrailingActionProps as PrimerNavListTrailingActionProps,
  NavListGroupExpandProps as PrimerNavListGroupExpandProps,
} from '@primer/react'
import {forwardRef, type ComponentProps, type PropsWithChildren} from 'react'
import {type SxProp} from '../sx'

type NavListProps = PropsWithChildren<PrimerNavListProps> & SxProp
type NavListItemProps = PropsWithChildren<PrimerNavListItemProps> & SxProp
type NavListGroupProps = PropsWithChildren<PrimerNavListGroupProps> & SxProp
type NavListGroupHeadingProps = PropsWithChildren<PrimerNavListGroupHeadingProps> & SxProp
type NavListLeadingVisualProps = PropsWithChildren<PrimerNavListLeadingVisualProps> & SxProp
type NavListTrailingVisualProps = PropsWithChildren<PrimerNavListTrailingVisualProps> & SxProp
type NavListTrailingActionProps = PropsWithChildren<PrimerNavListTrailingActionProps> & SxProp
type NavListGroupExpandProps = PropsWithChildren<PrimerNavListGroupExpandProps> & SxProp

const NavListImpl = forwardRef<HTMLElement, NavListProps>(function NavList(props, ref) {
  return <Box as={PrimerNavList} ref={ref} {...props} />
})

const NavListItem = forwardRef<HTMLAnchorElement, NavListItemProps>(function NavListItem(props, ref) {
  return <Box as={PrimerNavList.Item} ref={ref} {...props} />
})

const NavListGroup = forwardRef<HTMLLIElement, NavListGroupProps>(function NavListGroup(props, ref) {
  return <Box as={PrimerNavList.Group} ref={ref} {...props} />
})

// Add missing subcomponents with sx support
const NavListGroupHeading = forwardRef<HTMLDivElement, NavListGroupHeadingProps>(
  function NavListGroupHeading(props, ref) {
    return <Box as={PrimerNavList.GroupHeading} ref={ref} {...props} />
  },
)

const NavListLeadingVisual = forwardRef<HTMLSpanElement, NavListLeadingVisualProps>(
  function NavListLeadingVisual(props, ref) {
    return <Box as={PrimerNavList.LeadingVisual} ref={ref} {...props} />
  },
)

const NavListTrailingVisual = forwardRef<HTMLSpanElement, NavListTrailingVisualProps>(
  function NavListTrailingVisual(props, ref) {
    return <Box as={PrimerNavList.TrailingVisual} ref={ref} {...props} />
  },
)

const NavListTrailingAction = forwardRef<HTMLButtonElement, NavListTrailingActionProps>(
  function NavListTrailingAction(props, ref) {
    return <Box as={PrimerNavList.TrailingAction} ref={ref} {...props} />
  },
)

const NavListGroupExpand = forwardRef<HTMLButtonElement, NavListGroupExpandProps>(
  function NavListGroupExpand(props, ref) {
    return <Box as={PrimerNavList.GroupExpand} ref={ref} {...props} />
  },
)

const NavList = Object.assign(NavListImpl, {
  Item: NavListItem,
  Group: NavListGroup,
  GroupHeading: NavListGroupHeading,
  LeadingVisual: NavListLeadingVisual,
  TrailingVisual: NavListTrailingVisual,
  TrailingAction: NavListTrailingAction,
  GroupExpand: NavListGroupExpand,
  SubNav: PrimerNavList.SubNav as React.FC<React.PropsWithChildren<ComponentProps<typeof PrimerNavList.SubNav>>>,
  Divider: PrimerNavList.Divider as React.FC<React.PropsWithChildren<ComponentProps<typeof PrimerNavList.Divider>>>,
})

export {NavList, type NavListProps}
