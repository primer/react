import {
  CircleBadge as PrimerCircleBadge,
  type CircleBadgeProps as PrimerCircleBadgeProps,
  sx,
  type SxProp,
} from '@primer/react'
import styled from 'styled-components'
import {type ForwardRefComponent} from '../polymorphic'

type CircleBadgeProps<As extends React.ElementType> = PrimerCircleBadgeProps<As> & SxProp

const CircleBadge: ForwardRefComponent<React.ElementType, CircleBadgeProps<React.ElementType>> = styled(
  PrimerCircleBadge,
).withConfig({
  shouldForwardProp: prop => (prop as keyof CircleBadgeProps<React.ElementType>) !== 'sx',
})<CircleBadgeProps<React.ElementType>>`
  ${sx}
`

export {CircleBadge}
export type {CircleBadgeProps}
