import {
  CircleBadge as PrimerCircleBadge,
  type CircleBadgeProps as PrimerCircleBadgeProps,
  sx,
  type SxProp,
} from '@primer/react'
import styled from 'styled-components'
import {type ForwardRefComponent} from '../polymorphic'

type CircleBadgeProps = PrimerCircleBadgeProps & SxProp

const CircleBadge: ForwardRefComponent<'div', CircleBadgeProps> = styled(PrimerCircleBadge).withConfig({
  shouldForwardProp: prop => (prop as keyof CircleBadgeProps) !== 'sx',
})<CircleBadgeProps>`
  ${sx}
`

export {CircleBadge}
export type {CircleBadgeProps}
