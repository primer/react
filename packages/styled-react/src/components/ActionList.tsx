import {
  ActionList as PrimerActionList,
  type ActionListProps as PrimerActionListProps,
  type ActionListGroupProps as PrimerActionListGroupProps,
  type ActionListItemProps as PrimerActionListItemProps,
  type ActionListLinkItemProps as PrimerActionListLinkItemProps,
  type ActionListDividerProps as PrimerActionListDividerProps,
  type ActionListDescriptionProps as PrimerActionListDescriptionProps,
  type ActionListLeadingVisualProps as PrimerActionListLeadingVisualProps,
  type ActionListTrailingVisualProps as PrimerActionListTrailingVisualProps,
} from '@primer/react'
import {Box} from './Box'
import {forwardRef} from 'react'
import type {ForwardRefExoticComponent, RefAttributes} from 'react'
import type {SxProp} from '../sx'
import type {ComponentPropsWithoutRef} from 'react'

// Add SxProp to each exported type
export type ActionListProps = PrimerActionListProps & SxProp
export type ActionListGroupProps = PrimerActionListGroupProps & SxProp

// GroupHeading props type is not exported from @primer/react, so use ComponentPropsWithoutRef
export type ActionListGroupHeadingProps = ComponentPropsWithoutRef<typeof PrimerActionList.GroupHeading> & SxProp
export type ActionListItemProps = PrimerActionListItemProps & SxProp
export type ActionListLinkItemProps = PrimerActionListLinkItemProps & SxProp
export type ActionListDividerProps = PrimerActionListDividerProps & SxProp
export type ActionListDescriptionProps = PrimerActionListDescriptionProps & SxProp
export type ActionListLeadingVisualProps = PrimerActionListLeadingVisualProps & SxProp
export type ActionListTrailingVisualProps = PrimerActionListTrailingVisualProps & SxProp
export type ActionListHeadingProps = ComponentPropsWithoutRef<typeof PrimerActionList.Heading> & SxProp
export type ActionListTrailingActionProps = ComponentPropsWithoutRef<typeof PrimerActionList.TrailingAction> & SxProp

const ActionListImpl = forwardRef<HTMLUListElement, ActionListProps>(function ActionList(props, ref) {
  return <Box as={PrimerActionList} ref={ref} {...props} />
})

export type ActionListComponent = ForwardRefExoticComponent<ActionListProps & RefAttributes<HTMLUListElement>> & {
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

export const ActionList: ActionListComponent = Object.assign(ActionListImpl, {
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
