import type {ItemInput, ItemProps} from '../FilteredActionList'

import {areItemsEqual, doesItemsIncludeItem, type SelectPanelMultiSelection} from './SelectPanel.shared'
import {sortItemsBySelection} from './SelectPanelNext.shared.utils'

export function getItemsInViewSet(items: ItemInput[]) {
  const set = new Set<string | number | ItemInput>()

  for (const item of items) {
    if (item.id !== undefined) {
      set.add(item.id)
    } else {
      set.add(item)
    }
  }

  return set
}

export function getSelectedItemsSet(selected: ItemInput[]) {
  const set = new Set<string | number | ItemInput>()

  for (const item of selected) {
    if (item.id !== undefined) {
      set.add(item.id)
    } else {
      set.add(item)
    }
  }

  return set
}

export function getNextMultiSelectedItemsAfterSelectAll({
  checked,
  items,
  itemsInViewSet,
  selected,
}: {
  checked: boolean
  items: ItemInput[]
  itemsInViewSet: Set<string | number | ItemInput>
  selected: ItemInput[]
}) {
  const selectedItemsNotInFilteredView = selected.filter(selectedItem => {
    if (selectedItem.id !== undefined) {
      return !itemsInViewSet.has(selectedItem.id)
    }

    return !itemsInViewSet.has(selectedItem)
  })

  if (checked) {
    return [...selectedItemsNotInFilteredView, ...items]
  }

  return selectedItemsNotInFilteredView
}

export function buildMultiItemsToRender({
  items,
  onSelectedChange,
  selected,
  selectedItemsSet,
  selectedOnSort,
  shouldOrderSelectedFirst,
}: {
  items: ItemInput[]
  onSelectedChange: SelectPanelMultiSelection['onSelectedChange']
  selected: ItemInput[]
  selectedItemsSet: Set<string | number | ItemInput>
  selectedOnSort: ItemInput[]
  shouldOrderSelectedFirst: boolean
}): ItemProps[] {
  const itemsWithSelectionState = items.map(item => {
    const selectedValue = item.id !== undefined ? selectedItemsSet.has(item.id) : selectedItemsSet.has(item)

    return {
      ...item,
      role: 'option',
      id: item.id,
      selected: 'selected' in item && item.selected === undefined ? undefined : selectedValue,
      onAction: (itemFromAction, event) => {
        item.onAction?.(itemFromAction, event)

        if (event.defaultPrevented) {
          return
        }

        const otherSelectedItems = selected.filter(selectedItem => !areItemsEqual(selectedItem, item))
        const newSelectedItems = doesItemsIncludeItem(selected, item)
          ? otherSelectedItems
          : [...otherSelectedItems, item]

        onSelectedChange(newSelectedItems)
      },
    } as ItemProps
  })

  return sortItemsBySelection({
    items: itemsWithSelectionState,
    selectedOnSort,
    shouldOrderSelectedFirst,
  })
}
