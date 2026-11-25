import type {ItemInput} from '../FilteredActionList/types'
import type {SelectPanelMultiSelection, SelectPanelSingleSelection} from '../SelectPanel/types'

export function isMultiSelectVariant(
  selected: SelectPanelSingleSelection['selected'] | SelectPanelMultiSelection['selected'],
): selected is SelectPanelMultiSelection['selected'] {
  return Array.isArray(selected)
}

export function areItemsEqual(itemA: ItemInput, itemB: ItemInput) {
  // Preserve configured identity: an explicit ID wins, otherwise compare objects.
  if (typeof itemA.id !== 'undefined') return itemA.id === itemB.id
  return itemA === itemB
}

export function doesItemsIncludeItem(items: ItemInput[], item: ItemInput) {
  return items.some(i => areItemsEqual(i, item))
}

export function getSelectedItems(
  selected: SelectPanelSingleSelection['selected'] | SelectPanelMultiSelection['selected'],
): ItemInput[] {
  if (isMultiSelectVariant(selected)) return selected
  return selected ? [selected] : []
}
