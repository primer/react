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
import {forwardRef, type PropsWithChildren} from 'react'
import type {SxProp} from '../sx'

export type ActionListProps = PropsWithChildren<PrimerActionListProps> & SxProp
export type ActionListGroupProps = PropsWithChildren<PrimerActionListGroupProps> & SxProp
export type ActionListGroupHeadingProps = PropsWithChildren<PrimerActionListGroupHeadingProps> & SxProp
export type ActionListItemProps = PropsWithChildren<PrimerActionListItemProps> & SxProp
export type ActionListLinkItemProps = PropsWithChildren<PrimerActionListLinkItemProps> & SxProp
export type ActionListDividerProps = PropsWithChildren<PrimerActionListDividerProps> & SxProp
export type ActionListDescriptionProps = PropsWithChildren<PrimerActionListDescriptionProps> & SxProp
export type ActionListLeadingVisualProps = PropsWithChildren<PrimerActionListLeadingVisualProps> & SxProp
export type ActionListTrailingVisualProps = PropsWithChildren<PrimerActionListTrailingVisualProps> & SxProp
export type ActionListHeadingProps = PropsWithChildren<PrimerActionListHeadingProps> & SxProp
export type ActionListTrailingActionProps = PropsWithChildren<PrimerActionListTrailingActionProps> & SxProp

const ActionListImpl = forwardRef<HTMLUListElement, ActionListProps>(function ActionList(props, ref) {
  return <Box as={PrimerActionList} ref={ref} {...props} />
})

type ActionListComponent = typeof ActionListImpl & {
  Group: typeof PrimerActionList.Group
  GroupHeading: typeof PrimerActionList.GroupHeading
  Item: typeof PrimerActionList.Item
  LinkItem: typeof PrimerActionList.LinkItem
  Divider: typeof PrimerActionList.Divider
  Description: typeof PrimerActionList.Description
  LeadingVisual: typeof PrimerActionList.LeadingVisual
  TrailingVisual: typeof PrimerActionList.TrailingVisual
  Heading: typeof PrimerActionList.Heading
  TrailingAction: typeof PrimerActionList.TrailingAction
}

const ActionList: ActionListComponent = Object.assign(ActionListImpl, {
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

export {ActionList}
