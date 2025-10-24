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
  return <Box {...props} as={PrimerActionList} ref={ref} />
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
  return <Box {...props} as={PrimerActionList.Group} />
}

function ActionListDivider(props: ActionListDividerProps) {
  return <Box {...props} as={PrimerActionList.Divider} />
}

const ActionList = Object.assign(ActionListImpl, {
  Item: ActionListItem,
  Group: ActionListGroup,
  Divider: ActionListDivider,
})

export type {ActionListProps, ActionListItemProps, ActionListGroupProps}
export {ActionList}
