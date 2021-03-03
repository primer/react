import React from 'react'
import styled from 'styled-components'
import Box from './Box'
import {POSITION, SystemPositionProps} from './constants'
import sx from './sx'
import {ComponentProps} from './utils/types'

type StyledPositionProps = {as?: React.ElementType} & SystemPositionProps

const Position = styled(Box)<StyledPositionProps>`
  ${POSITION};
  ${sx};
`

export type PositionProps = ComponentProps<typeof Position>
export default Position

// Absolute
export type AbsoluteProps = Omit<PositionProps, 'position'>
export function Absolute(props: AbsoluteProps) {
  return <Position {...props} position="absolute" />
}

// Fixed
export type FixedProps = Omit<PositionProps, 'position'>
export function Fixed(props: AbsoluteProps) {
  return <Position {...props} position="fixed" />
}

// Relative
export type RelativeProps = Omit<PositionProps, 'position'>
export function Relative(props: RelativeProps) {
  return <Position {...props} position="relative" />
}

// Sticky
export type StickyProps = Omit<PositionProps, 'position'>
export function Sticky(props: StickyProps) {
  return <Position {...props} position="sticky" />
}
Sticky.defaultProps = {top: 0, zIndex: 1}
