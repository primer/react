import type {ItemInput, ItemProps} from '../FilteredActionList'

import type {SelectPanelProps} from './SelectPanel.shared'
import {buildSingleItemsToRender} from './SelectPanelNext.single.utils'

export interface SelectPanelNextSingleModeConfig {
  ariaMultiselectable: 'false'
  isMultiSelect: false
  itemsToRender: ItemProps[]
  selectionVariant: 'single' | 'radio'
}

export function getSelectPanelNextSingleModeConfig({
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
  onSelectedChange: (selected: ItemInput | undefined) => void
  onSelectionClose: () => void
  selected: ItemInput | undefined
  selectedOnSort: ItemInput[]
  shouldOrderSelectedFirst: boolean
}): SelectPanelNextSingleModeConfig {
  return {
    ariaMultiselectable: 'false',
    isMultiSelect: false,
    selectionVariant: isSingleSelectModal ? 'radio' : 'single',
    itemsToRender: buildSingleItemsToRender({
      intermediateSelected,
      isSingleSelectModal,
      items,
      onIntermediateSelectedChange,
      onSelectedChange,
      onSelectionClose,
      selected,
      selectedOnSort,
      shouldOrderSelectedFirst,
    }),
  }
}

export function handleSingleModeSave({
  intermediateSelected,
  isSingleSelectModal,
  onClose,
  onSelectedChange,
  variant,
}: {
  intermediateSelected?: ItemInput
  isSingleSelectModal: boolean
  onClose: (gesture: 'selection' | 'click-outside') => void
  onSelectedChange: (selected: ItemInput | undefined) => void
  variant: SelectPanelProps['variant']
}) {
  if (isSingleSelectModal) {
    onSelectedChange(intermediateSelected)
  }

  onClose(variant === 'modal' ? 'selection' : 'click-outside')
}
