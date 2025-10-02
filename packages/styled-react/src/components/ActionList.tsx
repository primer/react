import React, {forwardRef} from 'react'
import styled from 'styled-components'
import {
  ActionList as PrimerActionList,
  type ActionListProps as PrimerActionListProps,
  type ActionListItemProps as PrimerActionListItemProps,
  type ActionListLinkItemProps as PrimerActionListLinkItemProps,
  type ActionListGroupProps as PrimerActionListGroupProps,
  type ActionListDividerProps as PrimerActionListDividerProps,
  type ActionListDescriptionProps as PrimerActionListDescriptionProps,
  type ActionListLeadingVisualProps as PrimerActionListLeadingVisualProps,
  type ActionListTrailingVisualProps as PrimerActionListTrailingVisualProps,
} from '@primer/react'
import {sx, type SxProp} from '../sx'
import type {ForwardRefComponent} from '../polymorphic'
import {Box} from './Box'

type PrimerActionListTrailingActionProps = React.ComponentProps<typeof PrimerActionList.TrailingAction>

export type ActionListProps<As extends React.ElementType = 'ul'> = PrimerActionListProps<As> & SxProp
export type ActionListItemProps = React.PropsWithChildren<PrimerActionListItemProps & SxProp>
export type ActionListLinkItemProps = PrimerActionListLinkItemProps & SxProp
export type ActionListGroupProps = React.PropsWithChildren<PrimerActionListGroupProps & SxProp>
export type ActionListDividerProps = React.PropsWithChildren<PrimerActionListDividerProps & SxProp>
export type ActionListDescriptionProps = React.PropsWithChildren<PrimerActionListDescriptionProps & SxProp>
export type ActionListLeadingVisualProps = React.PropsWithChildren<PrimerActionListLeadingVisualProps & SxProp>
export type ActionListTrailingVisualProps = React.PropsWithChildren<PrimerActionListTrailingVisualProps & SxProp>
export type ActionListTrailingActionProps = PrimerActionListTrailingActionProps & SxProp

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

const ActionListLinkItem: ForwardRefComponent<'a', ActionListLinkItemProps> = styled(
  PrimerActionList.LinkItem,
).withConfig<ActionListLinkItemProps>({
  shouldForwardProp: prop => prop !== 'sx',
})`
  ${sx}
`

type TrailingActionElements = 'button' | 'a'
const ActionListTrailingAction: ForwardRefComponent<TrailingActionElements, ActionListTrailingActionProps> = styled(
  PrimerActionList.TrailingAction,
).withConfig<ActionListTrailingActionProps>({
  shouldForwardProp: prop => prop !== 'sx',
})`
  ${sx}
`

const ActionListItem = forwardRef<HTMLLIElement, ActionListItemProps>(function Item(props, ref) {
  return <Box ref={ref} as={PrimerActionList.Item} {...props} />
})

function ActionListGroup(props: ActionListGroupProps) {
  return <Box as={PrimerActionList.Group} {...props} />
}

function ActionListDivider(props: ActionListDividerProps) {
  return <Box as={PrimerActionList.Divider} {...props} />
}

function ActionListLeadingVisual(props: ActionListLeadingVisualProps) {
  return <Box as={PrimerActionList.LeadingVisual} {...props} />
}

function ActionListTrailingVisual(props: ActionListTrailingVisualProps) {
  return <Box as={PrimerActionList.TrailingVisual} {...props} />
}

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
