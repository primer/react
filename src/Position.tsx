import React from 'react'
import styled from 'styled-components'
import Box from './Box'
import {POSITION, SystemPositionProps} from './constants'
import sx from './sx'
import {ComponentProps} from './utils/types'

type StyledPositionProps = {as?: React.ElementType} & SystemPositionProps

/**
 * @deprecated Please use the Box component instead.
 */
const Position = styled(Box)<StyledPositionProps>`
  ${POSITION};
  ${sx};
`

export type PositionProps = ComponentProps<typeof Position>

/**
 * @deprecated Please use the Box component instead.
 */
export default Position

// Absolute
export type AbsoluteProps = Omit<PositionProps, 'position'>

/**
 * @deprecated Please use the Box component instead.
 */
export const Absolute = React.forwardRef((props: AbsoluteProps, ref) => {
  return <Position {...props} position="absolute" ref={ref} />
})
Absolute.displayName = 'Absolute'

// Fixed
export type FixedProps = Omit<PositionProps, 'position'>

/**
 * @deprecated Please use the Box component instead.
 */
export const Fixed = React.forwardRef((props: AbsoluteProps, ref) => {
  return <Position {...props} position="fixed" ref={ref} />
})
Fixed.displayName = 'Fixed'

// Relative
export type RelativeProps = Omit<PositionProps, 'position'>

/**
 * @deprecated Please use the Box component instead.
 */
export const Relative = React.forwardRef((props: RelativeProps, ref) => {
  return <Position {...props} position="relative" ref={ref} />
})
Relative.displayName = 'Relative'

// Sticky
export type StickyProps = Omit<PositionProps, 'position'>

/**
 * @deprecated Please use the Box component instead.
 */
export const Sticky = React.forwardRef((props: StickyProps, ref) => {
  return <Position {...props} position="sticky" ref={ref} />
})
Sticky.defaultProps = {top: 0, zIndex: 1}
Sticky.displayName = 'Sticky'
