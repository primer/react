import React from 'react'
import styled from 'styled-components'
import Box from './Box'
import {POSITION, SystemPositionProps} from './constants'
import sx from './sx'
import {ComponentProps} from './utils/types'

const Position = styled(Box)<SystemPositionProps>`
  ${POSITION};
  ${sx};
`

export type PositionProps = ComponentProps<typeof Position>
export default Position

// Absolute
export type AbsoluteProps = PositionProps
export function Absolute(props: AbsoluteProps) {
  return <Position {...props} position="absolute" />
}

// Fixed
export type FixedProps = PositionProps
export function Fixed(props: AbsoluteProps) {
  return <Position {...props} position="fixed" />
}

// Relative
export type RelativeProps = PositionProps
export function Relative(props: RelativeProps) {
  return <Position {...props} position="relative" />
}

// Sticky
export type StickyProps = PositionProps
export function Sticky(props: StickyProps) {
  return <Position {...props} position="sticky" />
}
Sticky.defaultProps = {top: 0, zIndex: 1}
