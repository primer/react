import React from 'react'
import styled from 'styled-components'
import Box, {BoxProps} from './Box'
import {POSITION, SystemPositionProps} from './constants'
import sx from './sx'
import {ForwardRefComponent} from './utils/polymorphic'

const defaultElement = 'div'

export type PositionProps = BoxProps & SystemPositionProps

// TODO: get default element of box
type PositionComponent = ForwardRefComponent<typeof defaultElement, PositionProps>

const Position = styled(Box)<PositionProps>`
  ${POSITION};
  ${sx};
` as PositionComponent

export default Position

// Absolute

export type AbsoluteProps = Omit<PositionProps, 'position'>

type AbsoluteComponent = ForwardRefComponent<typeof defaultElement, AbsoluteProps>

export const Absolute = React.forwardRef(({as = defaultElement, ...props}, ref) => {
  return <Position as={as} ref={ref} {...props} position="absolute" />
}) as AbsoluteComponent

Absolute.displayName = 'Absolute'

// Fixed

export type FixedProps = Omit<PositionProps, 'position'>

type FixedComponent = ForwardRefComponent<typeof defaultElement, FixedProps>

export const Fixed = React.forwardRef(({as = defaultElement, ...props}, ref) => {
  return <Position as={as} ref={ref} {...props} position="fixed" />
}) as FixedComponent

Fixed.displayName = 'Fixed'

// Relative

export type RelativeProps = Omit<PositionProps, 'position'>

type RelativeComponent = ForwardRefComponent<typeof defaultElement, RelativeProps>

export const Relative = React.forwardRef(({as = defaultElement, ...props}, ref) => {
  return <Position as={as} ref={ref} {...props} position="relative" />
}) as RelativeComponent

Relative.displayName = 'Relative'

// Sticky

export type StickyProps = Omit<PositionProps, 'position'>

type StickyComponent = ForwardRefComponent<typeof defaultElement, StickyProps>

export const Sticky = React.forwardRef(({as = defaultElement, ...props}, ref) => {
  return <Position as={as} ref={ref} {...props} position="sticky" />
}) as StickyComponent

Sticky.displayName = 'Sticky'
Sticky.defaultProps = {top: 0, zIndex: 1}
