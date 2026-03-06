import type {SlotMarker, WithSlotMarker} from './types'

/**
 * Determines whether a given element is a valid slot for the supplied slot component
 */
export function isSlot(element: unknown, slot: WithSlotMarker<unknown>): boolean {
  const elementType = typeof element

  if (elementType !== 'object' && elementType !== 'function' && element != null) {
    return false
  }
  const reactElement = element as {type?: SlotMarker} & SlotMarker

  const elementSlot = reactElement.__SLOT__ ?? reactElement.type?.__SLOT__
  return slot.__SLOT__ ? elementSlot === slot.__SLOT__ : false
}
