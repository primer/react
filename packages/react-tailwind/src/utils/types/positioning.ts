export type FloatingSide = 'top' | 'bottom' | 'left' | 'right' | 'inline-end' | 'inline-start'

export type FloatingAlignment = 'start' | 'center' | 'end'

export interface FloatingOffsetData {
  side: FloatingSide
  align: FloatingAlignment
  anchor: {
    width: number
    height: number
  }
  positioner: {
    width: number
    height: number
  }
}

export type FloatingOffset = number | ((data: FloatingOffsetData) => number)

/** Common positioner and portal configuration for floating content. */
export interface FloatingContentProps {
  align?: FloatingAlignment
  alignOffset?: FloatingOffset
  portal?: boolean
  positionerClassName?: string
  side?: FloatingSide
  sideOffset?: FloatingOffset
}
