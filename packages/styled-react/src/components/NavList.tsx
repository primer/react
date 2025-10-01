import {NavList as PrimerNavList, Box} from '@primer/react'
import type {
  NavListProps as PrimerNavListProps,
  NavListItemProps as PrimerNavListItemProps,
  NavListGroupProps as PrimerNavListGroupProps,
  NavListGroupHeadingProps as PrimerNavListGroupHeadingProps,
  NavListLeadingVisualProps as PrimerNavListLeadingVisualProps,
} from '@primer/react'
import {forwardRef, type ComponentProps, type PropsWithChildren} from 'react'
import {type SxProp} from '../sx'

type RefComponent<E extends HTMLElement, P> = React.ForwardRefExoticComponent<P & React.RefAttributes<E>>

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

type NavListGroupHeadingProps = PropsWithChildren<PrimerNavListGroupHeadingProps> & SxProp

const NavListGroupHeading = forwardRef<HTMLElement, NavListGroupHeadingProps>(function NavListGroupHeading(props, ref) {
  // @ts-expect-error - PrimerNavList.GroupHeading is not recognized as a valid component type
  return <Box as={PrimerNavList.GroupHeading} ref={ref} {...props} />
}) as RefComponent<HTMLElement, NavListGroupHeadingProps>

type NavListLeadingVisualProps = PropsWithChildren<PrimerNavListLeadingVisualProps> & SxProp

const NavListLeadingVisual = forwardRef<HTMLSpanElement, NavListLeadingVisualProps>(
  function NavListLeadingVisual(props, ref) {
    // @ts-expect-error - PrimerNavList.LeadingVisual is not recognized as a valid component type
    return <Box as={PrimerNavList.LeadingVisual} ref={ref} {...props} />
  },
) as RefComponent<HTMLSpanElement, NavListLeadingVisualProps>

type NavListCompound = React.ForwardRefExoticComponent<NavListProps & React.RefAttributes<HTMLElement>> & {
  Item: typeof NavListItem
  Group: typeof NavListGroup
  GroupHeading: typeof NavListGroupHeading
  LeadingVisual: typeof NavListLeadingVisual
  SubNav: typeof PrimerNavList.SubNav
  Divider: typeof PrimerNavList.Divider
  TrailingVisual: typeof PrimerNavList.TrailingVisual
  TrailingAction: typeof PrimerNavList.TrailingAction
  GroupExpand: typeof PrimerNavList.GroupExpand
}

const NavList: NavListCompound = Object.assign(NavListImpl, {
  Item: NavListItem,
  Group: NavListGroup,
  GroupHeading: NavListGroupHeading,
  LeadingVisual: NavListLeadingVisual,
  SubNav: PrimerNavList.SubNav,
  Divider: PrimerNavList.Divider,
  TrailingVisual: PrimerNavList.TrailingVisual,
  TrailingAction: PrimerNavList.TrailingAction,
  GroupExpand: PrimerNavList.GroupExpand,
})

export {NavList, type NavListProps}
