export interface SlotMarker {
  /** Marker to denote the custom child slot for a component */
  __SLOT__?: symbol
}

export type WithSlotMarker<T> = T & SlotMarker

export type FCWithSlotMarker<P> = WithSlotMarker<React.FC<P>>
