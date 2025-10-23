import {CircleBadge as PrimerCircleBadge, type CircleBadgeProps as PrimerCircleBadgeProps} from '@primer/react'
import styled from 'styled-components'
import {type ForwardRefComponent} from '../polymorphic'
import sx, {type SxProp} from '../sx'

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
