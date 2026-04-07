import type {ItemInput, ItemProps} from '../FilteredActionList'

import {type SelectPanelMultiSelection} from './SelectPanel.shared'
import {
  buildMultiItemsToRender,
  getNextMultiSelectedItemsAfterSelectAll,
  getSelectedItemsSet,
} from './SelectPanelNext.multi.utils'

export interface SelectPanelNextMultiModeConfig {
  isMultiSelect: true
  itemsToRender: ItemProps[]
  selectionVariant: 'multiple'
}

export function getSelectPanelNextMultiModeConfig({
  items,
  onSelectedChange,
  selected,
  selectedOnSort,
  shouldOrderSelectedFirst,
}: {
  items: ItemInput[]
  onSelectedChange: SelectPanelMultiSelection['onSelectedChange']
  selected: ItemInput[]
  selectedOnSort: ItemInput[]
  shouldOrderSelectedFirst: boolean
}): SelectPanelNextMultiModeConfig {
  const selectedItemsSet = getSelectedItemsSet(selected)

  return {
    isMultiSelect: true,
    selectionVariant: 'multiple',
    itemsToRender: buildMultiItemsToRender({
      items,
      onSelectedChange,
      selected,
      selectedItemsSet,
      selectedOnSort,
      shouldOrderSelectedFirst,
    }),
  }
}

export function handleSelectAllChange({
  checked,
  items,
  itemsInViewSet,
  onSelectedChange,
  selected,
}: {
  checked: boolean
  items: ItemInput[]
  itemsInViewSet: Set<string | number | ItemInput>
  onSelectedChange: SelectPanelMultiSelection['onSelectedChange']
  selected: ItemInput[]
}) {
  onSelectedChange(
    getNextMultiSelectedItemsAfterSelectAll({
      checked,
      items,
      itemsInViewSet,
      selected,
    }),
  )
}
