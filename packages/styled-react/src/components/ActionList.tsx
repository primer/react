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
  type SlotMarker,
} from '@primer/react'
import {sx, type SxProp} from '../sx'
import type {ForwardRefComponent} from '../polymorphic'

type PrimerActionListTrailingActionProps = React.ComponentProps<typeof PrimerActionList.TrailingAction>

export type ActionListProps<As extends React.ElementType = 'ul'> = PrimerActionListProps<As> & SxProp
export type ActionListItemProps = React.PropsWithChildren<PrimerActionListItemProps & SxProp>
export type ActionListLinkItemProps = React.PropsWithChildren<PrimerActionListLinkItemProps & SxProp> & {
  as?: React.ElementType
}
export type ActionListGroupProps = React.PropsWithChildren<PrimerActionListGroupProps & SxProp> & {
  as?: React.ElementType
}
export type ActionListDividerProps = React.PropsWithChildren<PrimerActionListDividerProps & SxProp>
export type ActionListLeadingVisualProps = React.PropsWithChildren<PrimerActionListLeadingVisualProps & SxProp> & {
  as?: React.ElementType
}
export type ActionListTrailingVisualProps = React.PropsWithChildren<PrimerActionListTrailingVisualProps & SxProp> & {
  as?: React.ElementType
}
export type ActionListTrailingActionProps = React.PropsWithChildren<PrimerActionListTrailingActionProps & SxProp>

const StyledActionList = styled(PrimerActionList).withConfig({
  shouldForwardProp: (prop: keyof ActionListProps) => prop !== 'sx',
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

const StyledActionListLinkItem: ForwardRefComponent<'a', ActionListLinkItemProps> & SlotMarker = styled(
  PrimerActionList.LinkItem,
).withConfig<ActionListLinkItemProps>({
  shouldForwardProp: prop => prop !== 'sx',
})`
  ${sx}
`

const ActionListLinkItem = React.forwardRef<HTMLAnchorElement, ActionListLinkItemProps>(
  ({children, as, ...props}, ref) => (
    <StyledActionListLinkItem ref={ref} {...props} {...(as ? {forwardedAs: as} : {})}>
      {children}
    </StyledActionListLinkItem>
  ),
) as ForwardRefComponent<'a', ActionListLinkItemProps> & SlotMarker
ActionListLinkItem.displayName = 'ActionListLinkItem'

type TrailingActionElements = 'button' | 'a'
const StyledActionListTrailingAction = styled(PrimerActionList.TrailingAction).withConfig({
  shouldForwardProp: (prop: keyof ActionListTrailingActionProps) => prop !== 'sx',
})`
  ${sx}
`

const ActionListTrailingAction = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ActionListTrailingActionProps>(
  (props, ref) => {
    const {as, ...rest} = props as ActionListTrailingActionProps & {as?: React.ElementType}
    return (
      <StyledActionListTrailingAction
        {...rest}
        {...(as ? {forwardedAs: as} : {})}
        ref={ref as React.Ref<HTMLElement>}
      />
    )
  },
) as ForwardRefComponent<TrailingActionElements, ActionListTrailingActionProps> & SlotMarker

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
)) as ForwardRefComponent<'li', ActionListItemProps> & SlotMarker

const StyledActionListGroup: React.ComponentType<ActionListGroupProps> & SlotMarker = styled(
  PrimerActionList.Group,
).withConfig<ActionListGroupProps>({
  shouldForwardProp: prop => prop !== 'sx',
})`
  ${sx}
`

const ActionListGroup: React.ComponentType<ActionListGroupProps> & SlotMarker = ({children, as, ...props}) => (
  <StyledActionListGroup {...props} {...(as ? {forwardedAs: as} : {})}>
    {children}
  </StyledActionListGroup>
)

const ActionListDivider: React.ComponentType<ActionListDividerProps> & SlotMarker = styled(
  PrimerActionList.Divider,
).withConfig<ActionListDividerProps>({
  shouldForwardProp: prop => prop !== 'sx',
})`
  ${sx}
`

const StyledActionListLeadingVisual: React.ComponentType<ActionListLeadingVisualProps> & SlotMarker = styled(
  PrimerActionList.LeadingVisual,
).withConfig<ActionListLeadingVisualProps>({
  shouldForwardProp: prop => prop !== 'sx',
})`
  ${sx}
`

const ActionListLeadingVisual: React.ComponentType<ActionListLeadingVisualProps> & SlotMarker = ({
  children,
  as,
  ...props
}) => (
  <StyledActionListLeadingVisual {...props} {...(as ? {forwardedAs: as} : {})}>
    {children}
  </StyledActionListLeadingVisual>
)

const StyledActionListTrailingVisual: React.ComponentType<ActionListTrailingVisualProps> & SlotMarker = styled(
  PrimerActionList.TrailingVisual,
).withConfig<ActionListTrailingVisualProps>({
  shouldForwardProp: prop => prop !== 'sx',
})`
  ${sx}
`

const ActionListTrailingVisual: React.ComponentType<ActionListTrailingVisualProps> & SlotMarker = ({
  children,
  as,
  ...props
}) => (
  <StyledActionListTrailingVisual {...props} {...(as ? {forwardedAs: as} : {})}>
    {children}
  </StyledActionListTrailingVisual>
)

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
} & SlotMarker = Object.assign(ActionListImpl, {
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

// Assign slot markers after component definitions
ActionListItem.__SLOT__ = PrimerActionList.Item.__SLOT__
ActionListLinkItem.__SLOT__ = PrimerActionList.LinkItem.__SLOT__
ActionListGroup.__SLOT__ = PrimerActionList.Group.__SLOT__
ActionListDivider.__SLOT__ = PrimerActionList.Divider.__SLOT__
ActionListLeadingVisual.__SLOT__ = PrimerActionList.LeadingVisual.__SLOT__
ActionListTrailingVisual.__SLOT__ = PrimerActionList.TrailingVisual.__SLOT__
ActionListTrailingAction.__SLOT__ = PrimerActionList.TrailingAction.__SLOT__
