import type {SlotMarker} from './types'

/**
 * Retrieves the slot symbol from a React element or component type.
 */
export function getSlot(element: unknown): symbol | undefined {
  const elementType = typeof element

  if (elementType !== 'object' && elementType !== 'function' && element != null) {
    return undefined
  }

  const reactElement = element as {type?: SlotMarker} & SlotMarker

  return reactElement.__SLOT__ ?? reactElement.type?.__SLOT__
}
