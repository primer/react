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

// @ts-ignore -- TS doesn't know about the __SLOT__ property
CircleBadge.__SLOT__ = PrimerCircleBadge.__SLOT__

export {CircleBadge}
export type {CircleBadgeProps}
