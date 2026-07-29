export type FloatingSide = 'top' | 'bottom' | 'left' | 'right' | 'inline-end' | 'inline-start'

export type FloatingAlignment = 'start' | 'center' | 'end'

export interface FloatingOffsetData {
  /** Side the content was placed on, which may differ from the requested side after collision handling. */
  side: FloatingSide
  /** Alignment the content was placed with. */
  align: FloatingAlignment
  /** Measured size of the anchor. */
  anchor: {
    width: number
    height: number
  }
  /** Measured size of the positioned content. */
  positioner: {
    width: number
    height: number
  }
}

export type FloatingOffset = number | ((data: FloatingOffsetData) => number)

/** Common positioner and portal configuration for floating content. */
export interface FloatingContentProps {
  /** Alignment of the content along the anchor's edge. */
  align?: FloatingAlignment
  /** Shift in pixels along the anchor's edge, or a callback that computes it from the measured sizes. */
  alignOffset?: FloatingOffset
  /** Where the content is rendered in the DOM. Set `false` to keep it in place. */
  portal?: boolean
  /** Classes applied to the element that positions the content. */
  positionerClassName?: string
  /** Side of the anchor the content opens on. */
  side?: FloatingSide
  /** Distance in pixels between the content and its anchor, or a callback that computes it. */
  sideOffset?: FloatingOffset
}
