import type {ItemInput, ItemProps} from '../FilteredActionList'

import type {SelectPanelProps} from './SelectPanel.shared'

export type FooterLayout =
  | {kind: 'legacy'; footer: SelectPanelProps['footer']}
  | {kind: 'none'}
  | {
      kind: 'actions'
      displayFooter: 'always' | 'only-small'
      showCancelAndSave: boolean
      showSaveAndClose: boolean
      stretchSaveButton: 'only-small' | 'never'
      stretchSecondaryAction: 'always' | 'only-big' | 'never'
    }

export function getFooterLayout({
  footer,
  hasSecondaryAction,
  hasOnCancel,
  isMultiSelect,
  usingFullScreenOnNarrow,
  variant,
}: {
  footer: SelectPanelProps['footer']
  hasOnCancel: boolean
  hasSecondaryAction: boolean
  isMultiSelect: boolean
  usingFullScreenOnNarrow: boolean
  variant: SelectPanelProps['variant']
}): FooterLayout {
  if (footer) {
    return {kind: 'legacy', footer}
  }

  const showPermanentCancelSave = variant === 'modal'
  const showResponsiveCancelSave = variant !== 'modal' && usingFullScreenOnNarrow && isMultiSelect && hasOnCancel
  const showResponsiveSaveAndClose = variant !== 'modal' && usingFullScreenOnNarrow && isMultiSelect && !hasOnCancel

  if (!hasSecondaryAction && !showPermanentCancelSave && !showResponsiveCancelSave && !showResponsiveSaveAndClose) {
    return {kind: 'none'}
  }

  return {
    kind: 'actions',
    displayFooter: hasSecondaryAction || showPermanentCancelSave ? 'always' : 'only-small',
    showCancelAndSave: showPermanentCancelSave || showResponsiveCancelSave,
    showSaveAndClose: showResponsiveSaveAndClose,
    stretchSecondaryAction:
      showResponsiveCancelSave || showResponsiveSaveAndClose
        ? 'only-big'
        : showPermanentCancelSave
          ? 'never'
          : 'always',
    stretchSaveButton: showResponsiveSaveAndClose && !hasSecondaryAction ? 'only-small' : 'never',
  }
}

export function sortItemsBySelection({
  items,
  selectedOnSort,
  shouldOrderSelectedFirst,
}: {
  items: ItemProps[]
  selectedOnSort: ItemInput[]
  shouldOrderSelectedFirst: boolean
}) {
  if (!shouldOrderSelectedFirst) {
    return items
  }

  const selectedOnSortSet = new Set<string | number | ItemInput>()

  for (const item of selectedOnSort) {
    if (item.id !== undefined) {
      selectedOnSortSet.add(item.id)
    } else {
      selectedOnSortSet.add(item)
    }
  }

  return items.sort((itemA, itemB) => {
    const itemASelected = itemA.id !== undefined ? selectedOnSortSet.has(itemA.id) : selectedOnSortSet.has(itemA)
    const itemBSelected = itemB.id !== undefined ? selectedOnSortSet.has(itemB.id) : selectedOnSortSet.has(itemB)

    if (itemASelected && !itemBSelected) {
      return -1
    }

    if (!itemASelected && itemBSelected) {
      return 1
    }

    return 0
  })
}
