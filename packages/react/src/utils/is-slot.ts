import type {WithSlotMarker} from './types'

export function isSlot(element: unknown, slot: WithSlotMarker<unknown>) {
  // @ts-ignore - TypeScript doesn't know about the __SLOT__ prop
  const elementSlot = element?.['__SLOT__'] ?? element?.type?.['__SLOT__']
  return slot.__SLOT__ ? elementSlot === slot.__SLOT__ : false
}
