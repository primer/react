import {
  ActionList as PrimerActionList,
  type ActionListProps as PrimerActionListProps,
  type ActionListGroupProps as PrimerActionListGroupProps,
  type ActionListGroupHeadingProps as PrimerActionListGroupHeadingProps,
  type ActionListItemProps as PrimerActionListItemProps,
  type ActionListLinkItemProps as PrimerActionListLinkItemProps,
  type ActionListDividerProps as PrimerActionListDividerProps,
  type ActionListDescriptionProps as PrimerActionListDescriptionProps,
  type ActionListLeadingVisualProps as PrimerActionListLeadingVisualProps,
  type ActionListTrailingVisualProps as PrimerActionListTrailingVisualProps,
  type ActionListHeadingProps as PrimerActionListHeadingProps,
  type ActionListTrailingActionProps as PrimerActionListTrailingActionProps,
} from '@primer/react'
import {Box} from './Box'
import {forwardRef} from 'react'
import type {SxProp} from '../sx'

// Add SxProp to each exported type
export type ActionListProps = PrimerActionListProps & SxProp
export type ActionListGroupProps = PrimerActionListGroupProps & SxProp
export type ActionListGroupHeadingProps = PrimerActionListGroupHeadingProps & SxProp
export type ActionListItemProps = PrimerActionListItemProps & SxProp
export type ActionListLinkItemProps = PrimerActionListLinkItemProps & SxProp
export type ActionListDividerProps = PrimerActionListDividerProps & SxProp
export type ActionListDescriptionProps = PrimerActionListDescriptionProps & SxProp
export type ActionListLeadingVisualProps = PrimerActionListLeadingVisualProps & SxProp
export type ActionListTrailingVisualProps = PrimerActionListTrailingVisualProps & SxProp
export type ActionListHeadingProps = PrimerActionListHeadingProps & SxProp
export type ActionListTrailingActionProps = PrimerActionListTrailingActionProps & SxProp

// Only wrap the root ActionList for sx support
const ActionListImpl = forwardRef<HTMLUListElement, ActionListProps>(function ActionList(props, ref) {
  return <Box as={PrimerActionList} ref={ref} {...props} />
})

// Re-attach subcomponents
export const ActionList = Object.assign(ActionListImpl, {
  Group: PrimerActionList.Group,
  GroupHeading: PrimerActionList.GroupHeading,
  Item: PrimerActionList.Item,
  LinkItem: PrimerActionList.LinkItem,
  Divider: PrimerActionList.Divider,
  Description: PrimerActionList.Description,
  LeadingVisual: PrimerActionList.LeadingVisual,
  TrailingVisual: PrimerActionList.TrailingVisual,
  Heading: PrimerActionList.Heading,
  TrailingAction: PrimerActionList.TrailingAction,
})
