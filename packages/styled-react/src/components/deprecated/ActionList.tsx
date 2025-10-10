import {type PropsWithChildren, forwardRef} from 'react'
import {
  ActionList as PrimerActionList,
  type ActionListProps as PrimerActionListProps,
  type ActionListItemProps as PrimerActionListItemProps,
  type ActionListGroupProps as PrimerActionListGroupProps,
} from '@primer/react/deprecated'
import {sx, type SxProp} from '../../sx'
import {Box} from '../Box'
import styled from 'styled-components'
import type {ActionListDividerProps} from '@primer/react'

type ActionListProps = PropsWithChildren<PrimerActionListProps & SxProp>
// Add explicit `as` prop since polymorphic typing doesn't carry over to type aliases
type ActionListItemProps = PropsWithChildren<PrimerActionListItemProps & SxProp & {as?: React.ElementType}>
type ActionListGroupProps = PropsWithChildren<PrimerActionListGroupProps & SxProp>

const ActionListImpl = forwardRef<HTMLDivElement, ActionListProps>(function ActionList(props, ref) {
  return <Box as={PrimerActionList} ref={ref} {...props} />
})

const StyledActionListItem = styled(PrimerActionList.Item).withConfig({
  shouldForwardProp: prop => (prop as keyof ActionListItemProps) !== 'sx',
})<ActionListItemProps>`
  ${sx}
`

const ActionListItem = forwardRef<HTMLLIElement, ActionListItemProps>(({as, ...props}, ref) => (
  <StyledActionListItem {...props} {...(as ? {forwardedAs: as} : {})} ref={ref} />
))

function ActionListGroup(props: ActionListGroupProps) {
  return <Box as={PrimerActionList.Group} {...props} />
}

function ActionListDivider(props: ActionListDividerProps) {
  return <Box as={PrimerActionList.Divider} {...props} />
}

const ActionList = Object.assign(ActionListImpl, {
  Item: ActionListItem,
  Group: ActionListGroup,
  Divider: ActionListDivider,
})

// @ts-ignore -- TS doesn't know about the __SLOT__ property
ActionListImpl.__SLOT__ = PrimerActionList.__SLOT__
// @ts-ignore -- TS doesn't know about the __SLOT__ property
ActionListItem.__SLOT__ = PrimerActionList.Item.__SLOT__
// @ts-ignore -- TS doesn't know about the __SLOT__ property
ActionListGroup.__SLOT__ = PrimerActionList.Group.__SLOT__
// @ts-ignore -- TS doesn't know about the __SLOT__ property
ActionListDivider.__SLOT__ = PrimerActionList.Divider.__SLOT__

export type {ActionListProps, ActionListItemProps, ActionListGroupProps}
export {ActionList}
