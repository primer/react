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

type PrimerActionListGroupHeadingProps = React.ComponentProps<typeof PrimerActionList.GroupHeading>
type PrimerActionListHeadingProps = React.ComponentProps<typeof PrimerActionList.Heading>
type PrimerActionListTrailingActionProps = React.ComponentProps<typeof PrimerActionList.TrailingAction>

export type ActionListProps<As extends React.ElementType = 'ul'> = PrimerActionListProps<As> & SxProp
export type ActionListItemProps = PrimerActionListItemProps & SxProp
export type ActionListLinkItemProps = PrimerActionListLinkItemProps & SxProp
export type ActionListGroupProps = PrimerActionListGroupProps & SxProp
export type ActionListGroupHeadingProps = PrimerActionListGroupHeadingProps & SxProp
export type ActionListDividerProps = PrimerActionListDividerProps & SxProp
export type ActionListDescriptionProps = PrimerActionListDescriptionProps & SxProp
export type ActionListLeadingVisualProps = PrimerActionListLeadingVisualProps & SxProp
export type ActionListTrailingVisualProps = PrimerActionListTrailingVisualProps & SxProp
export type ActionListHeadingProps = PrimerActionListHeadingProps & SxProp
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

type HeadingLevels = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
const ActionListHeading: ForwardRefComponent<HeadingLevels, ActionListHeadingProps> = styled(
  PrimerActionList.Heading,
).withConfig<ActionListHeadingProps>({
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

function ActionListGroupHeading(props: ActionListGroupHeadingProps) {
  return <Box as={PrimerActionList.GroupHeading} {...props} />
}

function ActionListDivider(props: ActionListDividerProps) {
  return <Box as={PrimerActionList.Divider} {...props} />
}

function ActionListDescription(props: ActionListDescriptionProps) {
  return <Box as={PrimerActionList.Description} {...props} />
}

function ActionListLeadingVisual(props: ActionListLeadingVisualProps) {
  return <Box as={PrimerActionList.LeadingVisual} {...props} />
}

function ActionListTrailingVisual(props: ActionListTrailingVisualProps) {
  return <Box as={PrimerActionList.TrailingVisual} {...props} />
}

export const ActionList = Object.assign(ActionListImpl, {
  Item: ActionListItem,
  LinkItem: ActionListLinkItem,
  Group: ActionListGroup,
  GroupHeading: ActionListGroupHeading,
  Divider: ActionListDivider,
  Description: ActionListDescription,
  LeadingVisual: ActionListLeadingVisual,
  TrailingVisual: ActionListTrailingVisual,
  Heading: ActionListHeading,
  TrailingAction: ActionListTrailingAction,
})
