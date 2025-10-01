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

const StyledActionListBase = styled(PrimerActionList).withConfig({
  shouldForwardProp: (prop: string | number, defaultValidatorFn: (prop: string | number) => boolean) =>
    prop !== 'sx' && defaultValidatorFn(prop),
})`
  ${sx}
`

const ActionListRoot = React.forwardRef(function ActionListRoot<As extends React.ElementType = 'ul'>(
  props: ActionListProps<As>,
  ref: React.Ref<any>,
) {
  const {as, ...rest} = props
  return <StyledActionListBase ref={ref} as={as as any} {...rest} />
}) as <As extends React.ElementType = 'ul'>(
  p: ActionListProps<As> & {ref?: React.Ref<any>},
) => React.ReactElement | null

const Item = forwardRef<any, ActionListItemProps>(function Item(props, ref) {
  return <Box as={PrimerActionList.Item as any} ref={ref} {...props} />
})

const LinkItem = forwardRef<any, ActionListLinkItemProps>(function LinkItem(props, ref) {
  return <Box as={PrimerActionList.LinkItem as any} ref={ref} {...props} />
})

const Group = forwardRef<any, ActionListGroupProps>(function Group(props, ref) {
  return <Box as={PrimerActionList.Group as any} ref={ref} {...props} />
})

const GroupHeading = (props: ActionListGroupHeadingProps) => (
  <Box as={PrimerActionList.GroupHeading as any} {...props} />
)

const Divider = forwardRef<any, ActionListDividerProps>(function Divider(props, ref) {
  return <Box as={PrimerActionList.Divider as any} ref={ref} {...props} />
})

const Description = (props: ActionListDescriptionProps) => <Box as={PrimerActionList.Description as any} {...props} />

const LeadingVisual = (props: ActionListLeadingVisualProps) => (
  <Box as={PrimerActionList.LeadingVisual as any} {...props} />
)

const TrailingVisual = (props: ActionListTrailingVisualProps) => (
  <Box as={PrimerActionList.TrailingVisual as any} {...props} />
)

const Heading = forwardRef<any, ActionListHeadingProps>(function Heading(props, ref) {
  return <Box ref={ref} {...props} as={PrimerActionList.Heading as any} />
})

const TrailingAction = forwardRef<any, ActionListTrailingActionProps>(function TrailingAction(props, ref) {
  return <Box as={PrimerActionList.TrailingAction as any} ref={ref} {...props} />
})

export const ActionList = Object.assign(ActionListRoot, {
  Item,
  LinkItem,
  Group,
  GroupHeading,
  Divider,
  Description,
  LeadingVisual,
  TrailingVisual,
  Heading,
  TrailingAction,
})
