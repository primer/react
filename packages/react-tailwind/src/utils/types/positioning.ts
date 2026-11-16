import type React from 'react'

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

/** A non-DOM anchor, such as a text selection or pointer position, described by its bounding rectangle. */
export interface FloatingVirtualAnchor {
  /** Returns the anchor's position and size in viewport coordinates. */
  getBoundingClientRect: () => DOMRect
  /** Element whose scroll containers keep the content attached to the anchor. */
  contextElement?: Element
}

/** What floating content is positioned against: an element, a ref to one, a virtual anchor, or a function returning either. */
export type FloatingAnchor =
  | Element
  | FloatingVirtualAnchor
  | React.RefObject<Element | null>
  | (() => Element | FloatingVirtualAnchor | null)
  | null

/**
 * How anchored content is presented at each viewport range. Only narrow viewports can present it fullscreen, where it
 * covers the viewport and shows a close button.
 */
export type AnchoredOverlayVariant =
  | 'anchored'
  | {narrow?: 'anchored' | 'fullscreen'; regular?: 'anchored'; wide?: 'anchored'}

/** Common positioner and portal configuration for floating content. */
export interface FloatingContentProps {
  /** Alignment of the content along the anchor's edge. */
  align?: FloatingAlignment
  /** Shift in pixels along the anchor's edge, or a callback that computes it from the measured sizes. */
  alignOffset?: FloatingOffset
  /** Positions the content against this anchor instead of the trigger, such as an element rendered elsewhere. */
  anchor?: FloatingAnchor
  /** Where the content is rendered in the DOM. Set `false` to keep it in place. */
  portal?: boolean
  /** Classes applied to the element that positions the content. */
  positionerClassName?: string
  /** Side of the anchor the content opens on. */
  side?: FloatingSide
  /** Distance in pixels between the content and its anchor, or a callback that computes it. */
  sideOffset?: FloatingOffset
}
