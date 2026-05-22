import {warning} from './warning'
import type {SlotMarker, WithSlotMarker} from './types'

/**
 * Copies the `__SLOT__` marker from a slot-aware source component onto another
 * component, returning the same component reference typed as a slot.
 *
 * Useful when building reusable wrappers around Primer slot components that
 * still need to be recognised by the parent's slot scanner.
 *
 * @example
 * ```tsx
 * const ColoredLeadingVisual = asSlot(
 *   function ColoredLeadingVisual({color, children}) {
 *     return <ActionList.LeadingVisual><span style={{color}}>{children}</span></ActionList.LeadingVisual>
 *   },
 *   ActionList.LeadingVisual,
 * )
 * ```
 */
export function asSlot<T>(component: T, slotSource: WithSlotMarker<unknown>): WithSlotMarker<T> {
  if (__DEV__) {
    warning(
      !slotSource.__SLOT__,
      'asSlot: the provided slotSource does not have a `__SLOT__` marker. The wrapper will not be recognised by the parent slot scanner.',
    )
  }
  ;(component as unknown as SlotMarker).__SLOT__ = slotSource.__SLOT__
  return component as WithSlotMarker<T>
}
