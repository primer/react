import {NavList as PrimerNavList} from '@primer/react'
import type {
  NavListProps as PrimerNavListProps,
  NavListItemProps as PrimerNavListItemProps,
  NavListLeadingVisualProps as PrimerNavListLeadingVisualProps,
  SlotMarker,
} from '@primer/react'
import {forwardRef, type PropsWithChildren} from 'react'
import {type SxProp} from '../sx'
import styled from 'styled-components'
import {sx} from '../sx'
import type {ForwardRefComponent} from '../polymorphic'

type NavListProps = PropsWithChildren<PrimerNavListProps> & SxProp & {as?: React.ElementType}

const StyledNavListImpl = styled(PrimerNavList).withConfig({
  shouldForwardProp: prop => (prop as keyof NavListProps) !== 'sx',
})<NavListProps>`
  ${sx}
`

const NavListImpl = forwardRef<HTMLElement, NavListProps>(function NavList({as, ...props}, ref) {
  return <StyledNavListImpl {...(as ? {forwardedAs: as} : {})} {...props} ref={ref} />
})

type NavListItemProps = PropsWithChildren<PrimerNavListItemProps> &
  SxProp & {
    as?: React.ElementType
  }

const StyledNavListItem: ForwardRefComponent<'a', NavListItemProps> = styled(PrimerNavList.Item).withConfig({
  shouldForwardProp: prop => (prop as keyof NavListItemProps) !== 'sx',
})<NavListItemProps>`
  ${sx}
`

const NavListItem = forwardRef<HTMLAnchorElement, NavListItemProps>(({as, ...props}, ref) => {
  return <StyledNavListItem {...props} {...(as ? {forwardedAs: as} : {})} ref={ref} />
}) as ForwardRefComponent<'a', NavListItemProps>

type NavListLeadingVisualProps = PropsWithChildren<PrimerNavListLeadingVisualProps> &
  SxProp & {
    as?: React.ElementType
  }

const StyledNavListLeadingVisual = styled(PrimerNavList.LeadingVisual).withConfig({
  shouldForwardProp: prop => (prop as keyof NavListLeadingVisualProps) !== 'sx',
})<NavListLeadingVisualProps>`
  ${sx}
`

const NavListLeadingVisual = forwardRef<HTMLSpanElement, NavListLeadingVisualProps>(({as, ...props}, ref) => {
  return <StyledNavListLeadingVisual {...props} {...(as ? {forwardedAs: as} : {})} ref={ref} />
}) as ForwardRefComponent<'span', NavListLeadingVisualProps>

;(NavListLeadingVisual as typeof NavListLeadingVisual & SlotMarker).__SLOT__ = PrimerNavList.LeadingVisual.__SLOT__

type NavListCompound = React.ForwardRefExoticComponent<NavListProps & React.RefAttributes<HTMLElement>> & {
  Item: typeof NavListItem
  Group: typeof PrimerNavList.Group
  GroupHeading: typeof PrimerNavList.GroupHeading
  LeadingVisual: typeof NavListLeadingVisual
  SubNav: typeof PrimerNavList.SubNav
  Divider: typeof PrimerNavList.Divider
  TrailingVisual: typeof PrimerNavList.TrailingVisual
  TrailingAction: typeof PrimerNavList.TrailingAction
  GroupExpand: typeof PrimerNavList.GroupExpand
}

const NavList: NavListCompound = Object.assign(NavListImpl, {
  Item: NavListItem,
  Group: PrimerNavList.Group,
  GroupHeading: PrimerNavList.GroupHeading,
  LeadingVisual: NavListLeadingVisual,
  SubNav: PrimerNavList.SubNav,
  Divider: PrimerNavList.Divider,
  TrailingVisual: PrimerNavList.TrailingVisual,
  TrailingAction: PrimerNavList.TrailingAction,
  GroupExpand: PrimerNavList.GroupExpand,
})

export {NavList, type NavListProps}
