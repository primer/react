import React from 'react'
import styled from 'styled-components'
import {
  ActionList as PrimerActionList,
  type ActionListProps as PrimerActionListProps,
  type ActionListItemProps as PrimerActionListItemProps,
  type ActionListLinkItemProps as PrimerActionListLinkItemProps,
  type ActionListGroupProps as PrimerActionListGroupProps,
  type ActionListDividerProps as PrimerActionListDividerProps,
  type ActionListLeadingVisualProps as PrimerActionListLeadingVisualProps,
  type ActionListTrailingVisualProps as PrimerActionListTrailingVisualProps,
} from '@primer/react'
import {sx, type SxProp} from '../sx'
import type {ForwardRefComponent} from '../polymorphic'

type PrimerActionListTrailingActionProps = React.ComponentProps<typeof PrimerActionList.TrailingAction>

export type ActionListProps<As extends React.ElementType = 'ul'> = PrimerActionListProps<As> & SxProp
export type ActionListItemProps = React.PropsWithChildren<PrimerActionListItemProps & SxProp>
export type ActionListLinkItemProps = PrimerActionListLinkItemProps &
  SxProp & {
    as?: React.ElementType
  }
export type ActionListGroupProps = React.PropsWithChildren<PrimerActionListGroupProps & SxProp>
export type ActionListDividerProps = React.PropsWithChildren<PrimerActionListDividerProps & SxProp>
export type ActionListLeadingVisualProps = React.PropsWithChildren<PrimerActionListLeadingVisualProps & SxProp>
export type ActionListTrailingVisualProps = React.PropsWithChildren<PrimerActionListTrailingVisualProps & SxProp>
export type ActionListTrailingActionProps = PrimerActionListTrailingActionProps &
  SxProp & {
    as?: React.ElementType
  }

const StyledActionList = styled(PrimerActionList).withConfig({
  shouldForwardProp: (prop: string | number) => prop !== 'sx',
})`
  ${sx}
` as typeof PrimerActionList & {
  <As extends React.ElementType = 'ul'>(props: ActionListProps<As>): React.ReactElement | null
}

const ActionListImpl = React.forwardRef(function ActionListImpl<As extends React.ElementType = 'ul'>(
  {as, ...rest}: ActionListProps<As>,
  ref: React.ComponentPropsWithRef<As>['ref'],
) {
  return <StyledActionList ref={ref} {...rest} {...(as ? {forwardedAs: as} : {})} />
})

const StyledActionListLinkItem = styled(PrimerActionList.LinkItem).withConfig({
  shouldForwardProp: (prop: string | number) => prop !== 'sx',
})`
  ${sx}
`

const ActionListLinkItem = React.forwardRef<HTMLAnchorElement, ActionListLinkItemProps>(({as, ...props}, ref) => (
  <StyledActionListLinkItem {...props} {...(as ? {forwardedAs: as} : {})} ref={ref} />
)) as ForwardRefComponent<'a', ActionListLinkItemProps>

type TrailingActionElements = 'button' | 'a'
const StyledActionListTrailingAction = styled(PrimerActionList.TrailingAction).withConfig({
  shouldForwardProp: (prop: string | number) => prop !== 'sx',
})`
  ${sx}
`

const ActionListTrailingAction = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ActionListTrailingActionProps>(
  ({as, ...props}, ref) => <StyledActionListTrailingAction {...props} {...(as ? {forwardedAs: as} : {})} ref={ref} />,
) as ForwardRefComponent<TrailingActionElements, ActionListTrailingActionProps>

const StyledActionListItem: ForwardRefComponent<'li', ActionListItemProps> = styled(
  PrimerActionList.Item,
).withConfig<ActionListItemProps>({
  shouldForwardProp: prop => prop !== 'sx',
})`
  ${sx}
`

const ActionListItem = React.forwardRef<HTMLLIElement, ActionListItemProps>(({children, as, ...props}, ref) => (
  <StyledActionListItem ref={ref} {...props} {...(as ? {forwardedAs: as} : {})}>
    {children}
  </StyledActionListItem>
)) as ForwardRefComponent<'li', ActionListItemProps>

const ActionListGroup: React.ComponentType<ActionListGroupProps> = styled(
  PrimerActionList.Group,
).withConfig<ActionListGroupProps>({
  shouldForwardProp: prop => prop !== 'sx',
})`
  ${sx}
`

const ActionListDivider: React.ComponentType<ActionListDividerProps> = styled(
  PrimerActionList.Divider,
).withConfig<ActionListDividerProps>({
  shouldForwardProp: prop => prop !== 'sx',
})`
  ${sx}
`

const ActionListLeadingVisual: React.ComponentType<ActionListLeadingVisualProps> = styled(
  PrimerActionList.LeadingVisual,
).withConfig<ActionListLeadingVisualProps>({
  shouldForwardProp: prop => prop !== 'sx',
})`
  ${sx}
`

const ActionListTrailingVisual: React.ComponentType<ActionListTrailingVisualProps> = styled(
  PrimerActionList.TrailingVisual,
).withConfig<ActionListTrailingVisualProps>({
  shouldForwardProp: prop => prop !== 'sx',
})`
  ${sx}
`

export const ActionList: typeof ActionListImpl & {
  Item: typeof ActionListItem
  LinkItem: typeof ActionListLinkItem
  Group: typeof ActionListGroup
  GroupHeading: typeof PrimerActionList.GroupHeading
  Divider: typeof ActionListDivider
  Description: typeof PrimerActionList.Description
  LeadingVisual: typeof ActionListLeadingVisual
  TrailingVisual: typeof ActionListTrailingVisual
  Heading: typeof PrimerActionList.Heading
  TrailingAction: typeof ActionListTrailingAction
} = Object.assign(ActionListImpl, {
  Item: ActionListItem,
  LinkItem: ActionListLinkItem,
  Group: ActionListGroup,
  GroupHeading: PrimerActionList.GroupHeading,
  Divider: ActionListDivider,
  Description: PrimerActionList.Description,
  LeadingVisual: ActionListLeadingVisual,
  TrailingVisual: ActionListTrailingVisual,
  Heading: PrimerActionList.Heading,
  TrailingAction: ActionListTrailingAction,
})
