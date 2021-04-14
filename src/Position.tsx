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
export const Absolute = React.forwardRef((props: AbsoluteProps, ref) => {
  return <Position {...props} position="absolute" ref={ref} />
})

// Fixed
export type FixedProps = Omit<PositionProps, 'position'>
export const Fixed = React.forwardRef((props: AbsoluteProps, ref) => {
  return <Position {...props} position="fixed" ref={ref} />
})

// Relative
export type RelativeProps = Omit<PositionProps, 'position'>
export const Relative = React.forwardRef((props: RelativeProps, ref) => {
  return <Position {...props} position="relative" ref={ref} />
})

// Sticky
export type StickyProps = Omit<PositionProps, 'position'>
export const Sticky = React.forwardRef((props: StickyProps, ref) => {
  return <Position {...props} position="sticky" ref={ref} />
})
Sticky.defaultProps = {top: 0, zIndex: 1}
