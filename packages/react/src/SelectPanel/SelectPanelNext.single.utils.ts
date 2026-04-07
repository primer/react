import type {ItemInput, ItemProps} from '../FilteredActionList'

import type {SelectPanelSingleSelection} from './SelectPanel.shared'
import {sortItemsBySelection} from './SelectPanelNext.shared.utils'

export function buildSingleItemsToRender({
  intermediateSelected,
  isSingleSelectModal,
  items,
  onIntermediateSelectedChange,
  onSelectedChange,
  onSelectionClose,
  selected,
  selectedOnSort,
  shouldOrderSelectedFirst,
}: {
  intermediateSelected?: ItemInput
  isSingleSelectModal: boolean
  items: ItemInput[]
  onIntermediateSelectedChange: (selectedItem?: ItemInput) => void
  onSelectedChange: SelectPanelSingleSelection['onSelectedChange']
  onSelectionClose: () => void
  selected: ItemInput | undefined
  selectedOnSort: ItemInput[]
  shouldOrderSelectedFirst: boolean
}): ItemProps[] {
  const itemsWithSelectionState = items.map(item => {
    const selectedValue = isSingleSelectModal
      ? intermediateSelected?.id !== undefined
        ? intermediateSelected.id === item.id
        : intermediateSelected === item
      : selected?.id !== undefined
        ? selected.id === item.id
        : selected === item

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

        if (isSingleSelectModal) {
          const nextIntermediateSelected = intermediateSelected?.id === item.id ? undefined : item
          onIntermediateSelectedChange(nextIntermediateSelected)
          return
        }

        onSelectedChange(item === selected ? undefined : item)
        onSelectionClose()
      },
    } as ItemProps
  })

  return sortItemsBySelection({
    items: itemsWithSelectionState,
    selectedOnSort,
    shouldOrderSelectedFirst,
  })
}
